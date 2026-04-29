"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadAndActivities = async () => {
      try {
        const [leadRes, activitiesRes] = await Promise.all([
          fetch(`/api/leads/${id}`),
          fetch(`/api/leads/${id}/activities`)
        ]);
        if (!leadRes.ok) throw new Error("Failed to fetch");
        const leadData = await leadRes.json();
        setLead(leadData.lead);

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.activities);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadAndActivities();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
      router.push("/dashboard/leads");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!lead) return <div>Lead not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
        <div className="space-x-3">
          <Link href={`/dashboard/leads/${id}/edit`} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Edit
          </Link>
          {session?.user?.role === "Admin" && (
            <button onClick={handleDelete} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              Delete
            </button>
          )}
          <Link href="/dashboard/leads" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Lead Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences.</p>
          </div>
          <div>
             <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5 ${
                lead.score === "High" ? "bg-red-100 text-red-800" :
                lead.score === "Medium" ? "bg-yellow-100 text-yellow-800" :
                "bg-green-100 text-green-800"
              }`}>
                {lead.score} Priority
              </span>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{lead.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:text-indigo-900">{lead.email}</a>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {lead.phone}
                <a 
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                >
                  WhatsApp
                </a>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Property Interest</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{lead.propertyInterest}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Budget</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Rs. {lead.budget.toLocaleString()}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{lead.status}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{lead.notes || "No notes."}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{lead.assignedTo?.name || "Unassigned"}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Activity Timeline */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Activity Timeline</h3>
        <div className="bg-white shadow sm:rounded-lg p-6">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500">No activities recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity._id} className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{activity.userId?.name || "Unknown User"}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">{activity.action}: </span>
                        {activity.details}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
