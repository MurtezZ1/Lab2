"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUser, getUserByCredentials, type StoreUser } from "@/lib/users";

export type LoginState = {
  message?: string;
};

export type RegisterState = {
  message?: string;
};

const setSessionCookies = async (user: StoreUser) => {
  const cookieStore = await cookies();

  cookieStore.set("sunspot_user_id", String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("sunspot_user_email", user.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("sunspot_username", user.username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("sunspot_user_role", user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { message: "Please fill in both email and password." };
  }

  const user = await getUserByCredentials(email, password);

  if (!user) {
    return { message: "Invalid email or password." };
  }

  await setSessionCookies(user);

  redirect("/account");
}

export async function register(_state: RegisterState, formData: FormData): Promise<RegisterState> {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!username || !email || !password || !confirmPassword) {
    return { message: "Please fill in all register fields." };
  }

  if (password.length < 8) {
    return { message: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { message: "Passwords do not match." };
  }

  try {
    const user = await createUser({ email, username, password });
    await setSessionCookies(user);
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Could not create account.",
    };
  }

  redirect("/account");
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("sunspot_user_id");
  cookieStore.delete("sunspot_user_email");
  cookieStore.delete("sunspot_username");
  cookieStore.delete("sunspot_user_role");

  redirect("/account");
}
