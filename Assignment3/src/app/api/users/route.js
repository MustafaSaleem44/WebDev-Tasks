import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const users = await User.find({ role: "Agent" }).select("name email role");

    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET Users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
