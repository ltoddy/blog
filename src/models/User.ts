import mongoose from "mongoose";

export interface IUser {
  email: String;
  username: String;
  passwordHash: String;

  name: String;
  bio: String;
}

export const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },

  name: { type: String, required: true },
  bio: String,
});

const User = mongoose.model("User", userSchema);


export default User;
