import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true, unique: true },
  password:    { type: String, required: true }, // store bcrypt hash
});

module.exports = mongoose.model('User', UserSchema);
