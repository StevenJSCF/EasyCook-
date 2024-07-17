import mongoose, { Document, Schema, model, models } from "mongoose";


export declare type UserParams = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  formCompleted: boolean;
};

export interface IUser extends Document {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  formCompleted: boolean;
}

const UserSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  photo: { type: String },
  formCompleted: {type: Boolean},
});

const User = models?.User || model("User", UserSchema);

export default User;
