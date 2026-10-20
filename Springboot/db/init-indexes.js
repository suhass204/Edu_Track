// Idempotent index creation. Run with: mongosh "$MONGODB_URI" db/init-indexes.js
db.admins.createIndex({ username: 1 }, { unique: true });

db.teachers.createIndex({ username: 1 }, { unique: true });
db.teachers.createIndex({ email: 1 }, { unique: true });

db.students.createIndex({ username: 1 }, { unique: true });
db.students.createIndex({ email: 1 }, { unique: true });
db.students.createIndex({ grade: 1 });

db.videos.createIndex({ grade: 1, subject: 1 });

db.notes.createIndex({ grade: 1 });

db.quizzes.createIndex({ teacherId: 1 });
db.quizzes.createIndex({ grade: 1, isActive: 1, deadline: 1 });
db.quizzes.createIndex({ "submissions.studentId": 1 });

db.progress.createIndex({ studentId: 1 });

db.video_interactions.createIndex({ studentId: 1 });
db.video_interactions.createIndex({ videoId: 1 });

print("Indexes created/verified.");
