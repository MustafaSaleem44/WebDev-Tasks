"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LeadsPage() {
  const { data: session } = useSession();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    let url = "/api/leads?";
    if (statusFilter) url += `status=${statusFilter}&`;
    if (priorityFilter) url += `priority=${priorityFilter}&`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    
    // Polling fallback for real-time updates
    const intervalId = setInterval(() => {
      fetchLeads();
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [statusFilter, priorityFilter]);

  const getScoreColor = (score) => {
    switch (score) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all leads in your account.</p>
        </div>
        {session?.user?.role === "Admin" && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/dashboard/leads/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add lead
            </Link>
          </div>
        )}
      </div>

      <div className="mt-4 flex space-x-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
        >
          <option value="">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Score</th>
                    {session?.user?.role === "Admin" && (
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                    )}
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-center text-sm text-gray-500">Loading...</td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-center text-sm text-gray-500">No leads found.</td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead._id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.status}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </span>
                        </td>
                        {session?.user?.role === "Admin" && (
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {lead.assignedTo?.name || "Unassigned"}
                          </td>
                        )}
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/dashboard/leads/${lead._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                            View
                          </Link>
                          <Link href={`/dashboard/leads/${lead._id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
