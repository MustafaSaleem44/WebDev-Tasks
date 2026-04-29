import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Lead } from "@/models/Lead";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sendEmail, emailTemplates } from "@/lib/email";
import { User } from "@/models/User";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const { id } = await params;
    
    const lead = await Lead.findById(id).populate('assignedTo', 'name email');
    
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const role = session.user.role;
    const userId = session.user.id;

    if (role === "Agent" && lead.assignedTo?._id.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("GET Lead error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();
    const { id } = await params;

    const lead = await Lead.findById(id);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const role = session.user.role;
    const userId = session.user.id;

    if (role === "Agent" && lead.assignedTo?.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only Admin can reassign
    if (body.assignedTo && role !== "Admin") {
      delete body.assignedTo;
    }

    const originalAssignedTo = lead.assignedTo?.toString();

    Object.assign(lead, body);
    await lead.save(); // using .save() to trigger pre-save middleware for scoring

    // Check if newly assigned
    if (body.assignedTo && body.assignedTo !== originalAssignedTo) {
      const agent = await User.findById(body.assignedTo);
      if (agent) {
        await sendEmail(agent.email, "Lead Assignment", emailTemplates.leadAssigned(lead.name, agent.name));
        await logActivity(lead._id, userId, "Assigned", `Lead assigned to ${agent.name}`);
      }
    } else {
      await logActivity(lead._id, userId, "Updated", "Lead details updated");
    }

    // TODO: Emit socket event for update

    return NextResponse.json({ message: "Lead updated successfully", lead });
  } catch (error) {
    console.error("PUT Lead error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    if (role !== "Admin") {
      return NextResponse.json({ error: "Forbidden - Admins only" }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    // TODO: Emit socket event
    await logActivity(lead._id, session.user.id, "Deleted", "Lead was deleted");

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("DELETE Lead error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
