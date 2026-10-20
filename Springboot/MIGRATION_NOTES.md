# EduTrack Migration Notes (p4 Node/Express -> springboot/)

Source of truth for the rewrite. Written once from reading p4; not re-read after this point.

## Decisions log (one line each)

- Filesystem root dir is `Springboot` (case-insensitive match to requested `springboot/`); Windows FS is case-insensitive so this is the same directory as `springboot/`.
- p4 auth stores plaintext passwords and does no hashing/JWT at all; new backend keeps identical request/response JSON shapes but adds BCrypt hashing and JWT issuance (p4 frontend doesn't use a JWT, but we return one in addition to existing fields for the admin-created-seed auth path forward-compat without breaking existing UI, since it ignores unknown response fields).
- p4 `TeacherDashboard.jsx` hardcodes `teacherId=507f1f77bcf86cd799439011` for its own dashboard (a bug in p4); replicated as-is since "do not modify p4 / keep behaviour identical" — this id simply won't resolve to a real teacher unless seeded, same as original.
- Users' `_id` is now `email` (per explicit requirement) instead of Mongo ObjectId. Teacher/Student/Admin documents keyed by email string. Quiz.teacherId / Progress.studentId / Quiz.submissions.studentId references switched from ObjectId to email string refs.
- Video.grade kept as String (matches p4 Video model) even though Student/Quiz grade is Number, to keep student video query (`grade` as raw query string) behaving the same.
- Video recommendation rebuilt as a separate Python FastAPI microservice (recommender/) called over HTTP from backend VideoService with timeout + fallback to popularity/recency sort if recommender is down.
- Default admin seeded on backend startup: username=admin, email=admin123@gmail.com, password=admin123 (BCrypt hashed), only if missing.
- CORS origins from `ALLOWED_ORIGINS` env (comma separated).
- Chatbot and progress-analysis Gemini integration reproduced in Java using direct REST call to Generative Language API (`GEMINI_API_KEY` env), since no need for Python there.
- File uploads (notes PDFs) stored to local `uploads/` dir on the API service and served at `/uploads/**`; on Render's ephemeral disk this is a known limitation (documented).

## Endpoints (method, path, auth, request, response)

All prefixed as in p4 (`/api/...`). No role-based auth middleware existed in p4 (any client could call any endpoint) — replicated identically; Spring Security permits all endpoints found below (`permitAll`), only using JWT it issues internally for the frontend to optionally store (not required by old frontend).

| Method | Path | Request Body | Response |
|---|---|---|---|
| POST | /api/setup-admin | {username,password} | {msg} |
| POST | /api/admin-login | {email,password} | {success} |
| POST | /api/add-teacher | {username,password,name,email,subjects?} | {success,message,teacher{_id,username,name,email,subjects}} |
| POST | /api/add-student | {username,password,name,email,grade,subjects?} | {success,message,student{_id,username,name,email,grade,subjects}} |
| POST | /api/teacher-login | {email,password} | {success,teacher{...}} |
| POST | /api/student-login | {email,password} | {success,student{...}} |
| GET  | /api/user/teacher/:teacherId | - | {success,teacher{...}} (teacherId = email) |
| GET  | /api/user/student/:studentId | - | {success,student{...}} (studentId = email) |
| POST | /api/teacher/add-video | {title,description,url,grade,subject,addedBy} | {message,video} |
| GET  | /api/student/videos?grade&subject | - | [video] |
| POST | /api/videos/recommend | {grade,subject} | {success,videos:[video]} |
| POST | /api/notes/upload (multipart: note=file, grade) | pdf only | {message,note} |
| GET  | /api/notes/grade/:grade | - | [note] |
| POST | /api/quiz/create | {title,subject,grade,mode,duration,numberOfQuestions,questions[],deadline,teacherId} | {success,message,quiz} |
| GET  | /api/quiz/teacher/:teacherId | - | {success,quizzes} |
| GET  | /api/quiz/student/:studentId | - | {success,quizzes} (filtered by student's grade, active, not expired) |
| GET  | /api/quiz/grade/:grade | - | {success,quizzes,grade} |
| GET  | /api/quiz/:quizId?studentId= | - | {success,quiz} (answers stripped for students; 403 if grade mismatch, 400 if already submitted) |
| POST | /api/quiz/:quizId/submit | {studentId,answers[],timeTaken} | {success,message,score,totalPoints,earnedPoints} |
| PUT  | /api/quiz/:quizId | partial quiz fields | {success,message,quiz} |
| DELETE | /api/quiz/:quizId | - | {success,message} |
| GET | /api/quiz/:quizId/results | - | {success,quiz} |
| GET | /api/quiz/teacher/:teacherId/progress?grade= | - | {success,data:{classStats,allStudents,topStudents,inactiveStudents}} |
| POST | /api/chatbot/query | {query,userRole} | {success,role,query,response} |
| POST | /api/progress/analyze | {studentId,quizResults[],score} | {success,message,analysis} |
| GET | /api/progress/:studentId | - | {success,data:[progress]} |
| GET | /api/progress | - | {success,data:[progress]} |
| GET | /uploads/:filename | - | static PDF |

## Collections / fields (see db/schema.md for full detail + indexes)

- admins: {_id(=email), username, password(hash)}
- teachers: {_id(=email), username, password(hash), name, subjects[], profilePic, isActive, createdAt, updatedAt}
- students: {_id(=email), username, password(hash), name, grade(Number 1-12), subjects[], profilePic, isActive, createdAt, updatedAt}
- videos: {_id, title, description, url, grade(String), subject, addedBy, createdAt}
- notes: {_id, filename, grade(String), uploadDate}
- quizzes: {_id, title, subject, grade(Number), mode, duration, numberOfQuestions, questions[{question,options[],correctAnswer,points}], teacherId(email ref), deadline, isActive, totalPoints, submissions[{studentId(email ref),score,answers[],submittedAt,timeTaken}], createdAt, updatedAt}
- progress: {_id, studentId(email ref), quizId, score, analysis{strengths[],weaknesses[],recommendedPath[],confidence,summary}}
- video_interactions (new, for recommender): {_id, studentId(email ref), videoId, watchedPercent, rating?, completedAt}

## Video recommendation logic (old -> new)

Old: spawn python per-request, TF-IDF over videos matching {grade,subject} only, cosine similarity of each video's text against the bare `subject` string, top 5, called from Node videoController -> Mongo lookup by id.
New (recommender/): FastAPI service with:
1. Preprocessing: lowercase, tokenize, stopword removal, light stemming (title+description+tags+subject).
2. TF-IDF (sublinear tf, unigrams+bigrams) + cosine similarity for content similarity between videos.
3. User profile vector from `video_interactions` (watch %, recency decay, completion), falls back to enrolled grade/subject videos, then global popularity when no history (cold start).
4. Final score = w1*content_sim + w2*profile_sim + w3*popularity + w4*recency, weights configurable via env, excludes already-completed videos.
5. `POST /recommend {studentId?, grade, subject, excludeIds?}` -> `{recommendations:[{videoId,score,reason}]}`; `GET /health`.
Backend's `/api/videos/recommend` calls this service (`RECOMMENDER_URL`), 2s timeout, falls back to popularity/recency Mongo sort on failure/timeout (never 500s).

## Env vars

Backend: MONGODB_URI, JWT_SECRET, ALLOWED_ORIGINS, RECOMMENDER_URL, GEMINI_API_KEY, PORT
Recommender: MONGODB_URI, PORT, REC_WEIGHT_CONTENT, REC_WEIGHT_PROFILE, REC_WEIGHT_POPULARITY, REC_WEIGHT_RECENCY
Frontend: VITE_API_URL (build-time)

## Post-launch fixes (per user feedback, after initial migration)

- Login for admin/teacher/student switched from username to **email** (the primary identifier /
  document _id), per explicit request. Username is still stored (signup still collects it, used
  for display) but is no longer the login key. Admin login credentials are therefore now
  `admin123@gmail.com` / `admin123` (not `admin`).
- Added two server-side grade-enforcement endpoints so a student can never fetch another grade's
  content by crafting a URL: `GET /api/notes/student/{studentId}` and
  `GET /api/student/{studentId}/videos?subject=` both resolve the grade from the student's own DB
  record, ignoring any client-supplied grade. The student-facing frontend pages (quizzes, notes,
  videos) were switched to use these and no longer expose a grade picker.
- Fixed a real logout bug: `logout(); navigate(path)` raced against `ProtectedRoute`'s own
  `<Navigate to="/">` redirect (triggered by the auth-context state change), so the explicit
  navigate frequently lost the race and logout always landed on Home instead of the login page.
  Fixed with a hard redirect (`window.location.href`) on logout, which sidesteps the race
  entirely.
- Fixed `AuthContext` to rehydrate `userType`/`user` from localStorage on load (useState lazy
  initializer) — previously a page refresh or direct link to a protected route always bounced an
  already-logged-in user to Home, since the in-memory context state reset on reload.
- Wired up all previously-decorative sidebar "Logout" buttons (teacher and student portals) and
  made the "EduTrack"/"EduTrack Teacher" header logo clickable to the user's own dashboard.
- Fixed `AddCredentials.jsx`'s "Back to Admin" link, which pointed at itself (`/admin/add`)
  instead of the admin login page (`/admin`).
- Replaced `StudentDashboard.jsx`'s hardcoded dashboard stats (fake quiz/video/progress numbers)
  with live data derived from the student's actual quizzes and progress records.
