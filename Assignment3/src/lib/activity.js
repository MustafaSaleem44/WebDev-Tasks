import { ActivityLog } from "@/models/ActivityLog";
import connectToDatabase from "./db";

export async function logActivity(leadId, userId, action, details) {
  try {
    await connectToDatabase();
    await ActivityLog.create({
      leadId,
      userId,
      action,
      details,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
