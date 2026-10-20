# EduTrack MongoDB schema (Atlas, db name: `edutrack`)

Users (admins/teachers/students) are keyed by **email** as `_id` (not an auto ObjectId). All
cross-collection references to a user are plain email strings.

## admins
| field | type | notes |
|---|---|---|
| _id | string | email |
| username | string | unique |
| password | string | bcrypt hash |

Index: `{ username: 1 }` unique.

## teachers
| field | type | notes |
|---|---|---|
| _id | string | email |
| username | string | unique |
| password | string | bcrypt hash |
| name | string | |
| email | string | == _id |
| subjects | string[] | enum: Mathematics, Science, English, History, Geography, Physics, Chemistry, Biology |
| profilePic | string | default avatar URL |
| isActive | bool | default true |
| createdAt, updatedAt | date | auto |

Indexes: `{ username: 1 }` unique, `{ email: 1 }` unique.

## students
Same shape as teachers plus `grade: Number (1-12)`.
Indexes: `{ username: 1 }` unique, `{ email: 1 }` unique, `{ grade: 1 }`.

## videos
| field | type |
|---|---|
| _id | ObjectId |
| title, description, url, subject, addedBy | string |
| grade | string (kept as string to match original query semantics) |
| createdAt | date |

Indexes: `{ grade: 1, subject: 1 }`.

## notes
| field | type |
|---|---|
| _id | ObjectId |
| filename | string |
| grade | string |
| uploadDate | date |

Index: `{ grade: 1 }`.

## quizzes
| field | type |
|---|---|
| _id | ObjectId |
| title, subject, mode | string |
| grade, duration, numberOfQuestions, totalPoints | number |
| questions | array of {question, options[], correctAnswer, points} |
| teacherId | string (email ref -> teachers._id) |
| deadline | date |
| isActive | bool |
| submissions | array of {studentId (email ref -> students._id), score, answers[], submittedAt, timeTaken} |
| createdAt, updatedAt | date |

Indexes: `{ teacherId: 1 }`, `{ grade: 1, isActive: 1, deadline: 1 }`, `{ "submissions.studentId": 1 }`.

## progress
| field | type |
|---|---|
| _id | ObjectId |
| studentId | string (email ref) |
| quizId | string |
| score | number |
| analysis | {strengths[], weaknesses[], recommendedPath[], confidence, summary} |

Index: `{ studentId: 1 }`.

## video_interactions (new — feeds the recommender)
| field | type |
|---|---|
| _id | ObjectId |
| studentId | string (email ref) |
| videoId | string (ref -> videos._id) |
| watchedPercent | number 0-100 |
| rating | number, optional |
| completedAt | date |

Index: `{ studentId: 1 }`, `{ videoId: 1 }`.

Run `init-indexes.js` (idempotent) to create all of the above. Run `seed-admin.js` to create
the default admin if missing (the Spring Boot app also does this on every startup).
