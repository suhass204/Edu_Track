const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('Admin', adminSchema);




// user.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   role: String, // 'admin', 'teacher', 'student'
// });

// module.exports = mongoose.model('User', userSchema);
