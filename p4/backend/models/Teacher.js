const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    subjects: [{
        type: String,
        enum: ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology']
    }],
    profilePic: {
        type: String,
        default: 'https://i.pravatar.cc/40?img=5'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
