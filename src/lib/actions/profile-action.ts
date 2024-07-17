import Profile, { UserProfileParams } from "../database/models/profile-model";
import  {connectToDatabase} from "../database/mongoose"
import { handleError } from "../utils";

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
