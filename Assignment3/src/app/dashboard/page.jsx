import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Lead } from "@/models/Lead";
import { ActivityLog } from "@/models/ActivityLog";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const userId = session?.user?.id;

  await connectToDatabase();

  // Fetch lead counts
  let totalLeads, newLeads, inProgressLeads, closedLeads;

  if (role === "Admin") {
    [totalLeads, newLeads, inProgressLeads, closedLeads] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: "New" }),
      Lead.countDocuments({ status: "In Progress" }),
      Lead.countDocuments({ status: "Closed" }),
    ]);
  } else {
    [totalLeads, newLeads, inProgressLeads, closedLeads] = await Promise.all([
      Lead.countDocuments({ assignedTo: userId }),
      Lead.countDocuments({ assignedTo: userId, status: "New" }),
      Lead.countDocuments({ assignedTo: userId, status: "In Progress" }),
      Lead.countDocuments({ assignedTo: userId, status: "Closed" }),
    ]);
  }

  // Fetch recent activity logs
  const recentActivity = await ActivityLog.find()
    .populate("userId", "name")
    .populate("leadId", "name")
    .sort({ createdAt: -1 })
    .limit(10);

  const stats = [
    { label: "Total Leads", value: totalLeads, color: "text-indigo-600" },
    { label: "New", value: newLeads, color: "text-blue-600" },
    { label: "In Progress", value: inProgressLeads, color: "text-yellow-600" },
    { label: "Closed", value: closedLeads, color: "text-green-600" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome, {session?.user?.name}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
              <dd className={`mt-1 text-3xl font-semibold ${stat.color}`}>{stat.value}</dd>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {recentActivity.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">
              No activity recorded yet.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((log) => (
                <li key={log._id.toString()} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{log.userId?.name || "Unknown"}</span>
                      {" — "}
                      <span className="font-semibold text-indigo-600">{log.action}</span>
                      {log.leadId?.name && (
                        <span className="text-gray-600"> on <span className="font-medium">{log.leadId.name}</span></span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{log.details}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
