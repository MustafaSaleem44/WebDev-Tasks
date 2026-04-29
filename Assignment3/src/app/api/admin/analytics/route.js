import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Lead } from "@/models/Lead";
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

    const totalLeads = await Lead.countDocuments();
    
    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const leadsByPriority = await Lead.aggregate([
      { $group: { _id: "$score", count: { $sum: 1 } } }
    ]);

    // Agent performance
    const agents = await User.find({ role: "Agent" }).select("name");
    const agentPerformance = await Promise.all(
      agents.map(async (agent) => {
        const assignedLeads = await Lead.countDocuments({ assignedTo: agent._id });
        const closedLeads = await Lead.countDocuments({ assignedTo: agent._id, status: "Closed" });
        return {
          agentName: agent.name,
          assignedLeads,
          closedLeads,
        };
      })
    );

    return NextResponse.json({
      totalLeads,
      leadsByStatus: leadsByStatus.map(s => ({ status: s._id, count: s.count })),
      leadsByPriority: leadsByPriority.map(p => ({ priority: p._id, count: p.count })),
      agentPerformance,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
