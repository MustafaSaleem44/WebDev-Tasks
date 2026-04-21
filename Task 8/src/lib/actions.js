"use server";

import bcrypt from "bcrypt";
import connectDB from "./db";
import User from "@/models/User";
import { setSession, clearSession } from "./session";
import { redirect } from "next/navigation";

export async function signupAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await connectDB();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email is already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await User.create({
      email,
      password: hashedPassword,
    });

  } catch (error) {
    return { error: error.message || "An error occurred during signup" };
  }
  
  redirect("/login");
}

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: "Invalid email or password" };
    }

    await setSession(user.id);

  } catch (error) {
    return { error: error.message || "An error occurred during login" };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
