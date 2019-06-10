import { Document, model, Model, Schema, Types } from "mongoose";

export interface IUser extends Document {
  id: Types.ObjectId;
  email: String;
  username: String;
  passwordHash: String;
  bio: String;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  bio: String,
});

const User: Model<IUser> = model<IUser>("User", UserSchema);

export default User;
