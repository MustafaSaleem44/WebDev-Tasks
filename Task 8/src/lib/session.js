import { cookies } from "next/headers";

export async function setSession(userId) {
  cookies().set("session", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
}

export async function getSession() {
  const sessionCookie = cookies().get("session");
  return sessionCookie?.value;
}

export async function clearSession() {
  cookies().delete("session");
}
