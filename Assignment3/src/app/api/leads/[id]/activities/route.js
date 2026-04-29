import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { ActivityLog } from "@/models/ActivityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { id } = await params;
    
    const activities = await ActivityLog.find({ leadId: id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ activities });
  } catch (error) {
    console.error("GET Activities error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
