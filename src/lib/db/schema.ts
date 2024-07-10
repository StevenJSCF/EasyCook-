import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  userId: string;
}
const userSchema: Schema = new mongoose.Schema({
  userId: { type: String, required: true,primaryKey: true, unique: true},
  name: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
