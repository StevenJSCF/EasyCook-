import User, { UserParams } from "../database/models/user-model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";


//CREATE
export async function createUser(user: UserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

//READ

//UPDATE
//DELETE
