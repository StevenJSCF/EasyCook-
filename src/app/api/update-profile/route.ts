import { updateUserProfile } from "@/lib/actions/profile-action";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils";
import { getAuth } from "@clerk/nextjs/server";
import toast from "react-hot-toast";

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    // Parse the request body
    const body = await req.json();

    // Construct the userProfile object

    console.log(body.userProfile);
    // Update the user profile
    const _user = await updateUserProfile(body.userProfile);

    return NextResponse.json({ success: true, user: _user }, { status: 200 });
  } catch (error) {
    handleError(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
