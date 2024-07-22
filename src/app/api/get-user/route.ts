import { getUserById } from "@/lib/actions/user-action"
import { useAuth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"

// /api/getUser
export async function GET(req: NextRequest, res: Response) {
//   const { userId } = await useAuth()
const { userId } = getAuth(req)

  // 1. checks if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  try {
    const _user = await getUserById(userId)
    return NextResponse.json(_user)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    )
  }
}