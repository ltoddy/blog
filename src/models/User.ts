import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: String;
  username: String;
  passwordHash: String;
  bio: String;
}

const User = mongoose.model("User", new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bio: String,
}));


export default User;
