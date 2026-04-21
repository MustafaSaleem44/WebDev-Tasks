import { getSession, clearSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { logoutAction } from "@/lib/actions";
import connectDB from "@/lib/db";
import User from "@/models/User";

export default async function DashboardPage() {
  const userId = await getSession();

  if (!userId) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(userId);

  // If session is present but user no longer exists in DB, clear session and redirect
  if (!user) {
    await clearSession();
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">Logged in as {user.email}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-96 flex items-center justify-center bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome to your Dashboard!</h2>
              <p className="text-gray-600 text-lg mb-1">Your email address:</p>
              <p className="text-blue-600 font-medium text-xl break-all"><strong>{user.email}</strong></p>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-sm">You have successfully authenticated using secure cookies.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mandatory Unique Logo & Copyright Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="mb-5 transform transition-transform hover:scale-110 duration-300">
            {/* Stylish circle logo with name */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-1.5 shadow-xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 blur-md group-hover:bg-white/30 transition-all"></div>
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white shadow-inner relative z-10">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 font-black text-2xl tracking-tighter" style={{ fontFamily: 'sans-serif' }}>
                  Mustafa
                </span>
                <div className="absolute inset-x-0 bottom-3 text-center overflow-hidden">
                   <span className="text-[0.45rem] uppercase tracking-widest text-gray-400 font-semibold block">Dev</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-gray-800">Mustafa Design Studios</p>
            <p className="text-sm text-gray-500 mt-1">
              &copy; {new Date().getFullYear()} Mustafa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
