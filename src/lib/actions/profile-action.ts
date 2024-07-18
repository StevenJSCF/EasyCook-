import Profile, { UserProfileParams } from "../database/models/profile-model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

//READ
export async function getProfileById(userId: string) {
  try {
    await connectToDatabase();

    const profile = await Profile.findOne({ userId: userId });

    if (!profile) {
      return null;
    }

    return JSON.parse(JSON.stringify(profile));
  } catch (error) {
    handleError(error);
  }
}

//CREATE
export async function createUserProfile(userProfile: UserProfileParams) {
  try {
    await connectToDatabase();

    const newUserProfile = await Profile.create(userProfile);

    return JSON.parse(JSON.stringify(newUserProfile));
  } catch (error) {
    handleError(error);
  }
}

//UPDATE
//DELETE
