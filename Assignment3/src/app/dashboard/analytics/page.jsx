"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role !== "Admin") return;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [session]);

  if (session?.user?.role !== "Admin") {
    return <div>Access Denied. Admins only.</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Failed to load analytics.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{data.totalLeads}</dd>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Leads by Status</h3>
          <ul className="divide-y divide-gray-200">
            {data.leadsByStatus.map((item) => (
              <li key={item.status} className="py-3 flex justify-between">
                <span className="text-gray-600">{item.status}</span>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Leads by Priority</h3>
          <ul className="divide-y divide-gray-200">
            {data.leadsByPriority.map((item) => (
              <li key={item.priority} className="py-3 flex justify-between">
                <span className="text-gray-600">{item.priority}</span>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Agent Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Leads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closed Leads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.agentPerformance.map((agent) => (
                  <tr key={agent.agentName}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent.agentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.assignedLeads}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.closedLeads}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.assignedLeads > 0 
                        ? `${Math.round((agent.closedLeads / agent.assignedLeads) * 100)}%` 
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
