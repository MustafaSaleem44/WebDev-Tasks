"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function EditLeadPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyInterest: "",
    budget: "",
    status: "",
    notes: "",
    assignedTo: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadRes, usersRes] = await Promise.all([
          fetch(`/api/leads/${id}`),
          session?.user?.role === "Admin" ? fetch("/api/users") : Promise.resolve(null),
        ]);

        if (!leadRes.ok) throw new Error("Failed to fetch lead");
        const leadData = await leadRes.json();
        
        setFormData({
          name: leadData.lead.name,
          email: leadData.lead.email,
          phone: leadData.lead.phone,
          propertyInterest: leadData.lead.propertyInterest,
          budget: leadData.lead.budget.toString(),
          status: leadData.lead.status,
          notes: leadData.lead.notes,
          assignedTo: leadData.lead.assignedTo?._id || "",
        });

        if (usersRes && usersRes.ok) {
          const usersData = await usersRes.json();
          setAgents(usersData.users);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchData();
    }
  }, [id, session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = { ...formData, budget: Number(formData.budget) };
      if (!payload.assignedTo) delete payload.assignedTo;

      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update lead");
      }

      router.push(`/dashboard/leads/${id}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Lead
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link href={`/dashboard/leads/${id}`} className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <div className="mt-1">
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white text-gray-900" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1">
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white text-gray-900" />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <div className="mt-1">
                <input type="text" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white text-gray-900" />
              </div>
            </div>

            <div>
              <label htmlFor="propertyInterest" className="block text-sm font-medium text-gray-700">Property Interest</label>
              <div className="mt-1">
                <input type="text" name="propertyInterest" id="propertyInterest" required value={formData.propertyInterest} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white text-gray-900" />
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (PKR)</label>
              <div className="mt-1">
                <input type="number" name="budget" id="budget" required value={formData.budget} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white text-gray-900" />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border bg-white text-gray-900">
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {session?.user?.role === "Admin" && (
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assigned Agent</label>
                <div className="mt-1">
                  <select id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border">
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <div className="mt-1">
                <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
