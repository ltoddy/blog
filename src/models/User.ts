import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  passwordHash: String,

  name: String,
  aboutMe: String,
});

const User = mongoose.model("User", userSchema);

export default User;