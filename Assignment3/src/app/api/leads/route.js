import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Lead } from "@/models/Lead";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { sendEmail, emailTemplates } from "@/lib/email";
import { applyRateLimit } from "@/lib/rateLimit";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const role = session.user.role;
    const userId = session.user.id;

    if (role === "Agent") {
      const rateLimitRes = applyRateLimit(userId, 50, 60000); // 50 requests per minute
      if (rateLimitRes) return rateLimitRes;
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const priorityFilter = searchParams.get("priority");

    let query = {};

    // Agent can only see their assigned leads
    if (role === "Agent") {
      query.assignedTo = userId;
    }

    if (statusFilter) query.status = statusFilter;
    if (priorityFilter) query.score = priorityFilter;

    const leads = await Lead.find(query).populate('assignedTo', 'name email').sort({ createdAt: -1 });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("GET Leads error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    const userId = session.user.id;

    // Only Admins can create leads
    if (role !== "Admin") {
      return NextResponse.json({ error: "Forbidden - Admins only" }, { status: 403 });
    }

    if (role === "Agent") {
      const rateLimitRes = applyRateLimit(userId, 50, 60000); // 50 requests per minute
      if (rateLimitRes) return rateLimitRes;
    }

    const body = await req.json();
    const { name, email, phone, propertyInterest, budget, status, notes } = body;

    if (!name || !email || !phone || !propertyInterest || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newLead = await Lead.create({
      name,
      email,
      phone,
      propertyInterest,
      budget,
      status: status || 'New',
      notes: notes || '',
    });

    // TODO: Emit socket event for new lead
    await logActivity(newLead._id, userId, "Created", "Lead created");
    
    // Send email to admin (or a configured email)
    await sendEmail("admin@lms.local", "New Lead Alert", emailTemplates.newLead(newLead.name, newLead.budget));

    return NextResponse.json({ message: "Lead created successfully", lead: newLead }, { status: 201 });
  } catch (error) {
    console.error("POST Leads error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
