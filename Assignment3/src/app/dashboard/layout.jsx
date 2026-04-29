import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">LMS</h2>
          <p className="text-sm text-gray-500 mt-1">{role} Panel</p>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">
            Dashboard
          </Link>
          <Link href="/dashboard/leads" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">
            Leads
          </Link>
          {role === "Admin" && (
            <Link href="/dashboard/analytics" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">
              Analytics
            </Link>
          )}
        </nav>
        <div className="p-4 mt-auto border-t">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
