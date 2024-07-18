import User, { UserParams } from "../database/models/user-model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

//READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ userId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(user))


  } catch (error) {
    handleError(error)
  }
}

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

//UPDATE
//DELETE
