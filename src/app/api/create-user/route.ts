import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/db/schema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const user = new User(body);
    await user.save();
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}