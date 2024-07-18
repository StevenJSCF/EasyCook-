/*
api/create-profile
*/

import { createUserProfile } from "@/lib/actions/profile-action";
import { UserProfileParams } from "@/lib/database/models/profile-model";
import { useAuth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server"

export async function POST(req: NextRequest, res: NextResponse) {
  // const { userId } = await useAuth();
  const { userId } = getAuth(req)
  const { userProfile } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const profile: UserProfileParams = {
      userId: userId,
      cuisine_preference: userProfile.cuisine_preference,
      disliked_food: userProfile.disliked_food,
      allergies: userProfile.allergies,
    };
    const _userProfile = await createUserProfile(profile);
    return NextResponse.json(_userProfile);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
