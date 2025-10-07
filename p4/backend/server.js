const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');
const notesRoutes = require('./routes/notes');

app.use('/api', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/uploads', express.static('uploads')); // Serve uploaded PDFs
app.use('/api/notes', notesRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
