import mongoose, { Document, Schema, model, models } from "mongoose";

export declare type UserProfileParams = {
  userId: string;
  cuisine_preference?: string;
  allergies?: string;
  disliked_food?: string;
};

export interface IUserProfile extends Document {
  userId: string;
  cuisine_preference?: string;
  allergies?: string;
  disliked_food?: string;
}

const UserProfileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  cuisine_preference: { type: String },
  allergies: { type: String },
  disliked_food: { type: String },
});

const Profile = models?.Profile || model("Profile", UserProfileSchema);

export default Profile;

