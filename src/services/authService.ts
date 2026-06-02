import axios from "axios";
import type { User } from "@/types";

const CURRENT_USER_KEY = "sunspot_current_user";
const ACCESS_TOKEN_KEY = "sunspot_access_token";
const REFRESH_TOKEN_KEY = "sunspot_refresh_token";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

const authClient = axios.create({ baseURL: API_URL });

function normalizeUser(user: User): User {
  return {
    ...user,
    role: user.role ?? user.roles?.[0] ?? "Customer",
    active: user.active ?? 1,
  };
}

export function getCurrentUser() {
  const user = window.localStorage.getItem(CURRENT_USER_KEY);
  return user ? (JSON.parse(user) as User) : null;
}

export function getAuthTokens() {
  return {
    accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function saveAuthTokens(accessToken?: string, refreshToken?: string) {
  if (accessToken) window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function saveSession(data: AuthResponse) {
  const user = normalizeUser({ ...data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
  saveAuthTokens(data.accessToken, data.refreshToken);
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  if (input.password !== input.confirmPassword) throw new Error("Passwords do not match.");
  const { data } = await authClient.post<{ data: AuthResponse }>("/auth/register", {
    username: input.username,
    email: input.email,
    password: input.password,
  });
  return saveSession(data.data);
}

export async function loginUser(input: { email: string; password: string }) {
  const { data } = await authClient.post<{ data: AuthResponse }>("/auth/login", input);
  return saveSession(data.data);
}

export async function refreshSession() {
  const { refreshToken } = getAuthTokens();
  if (!refreshToken) return null;
  const { data } = await authClient.post<{ data: AuthResponse }>("/auth/refresh-token", { refreshToken });
  return saveSession(data.data);
}

export async function logoutUser() {
  const { refreshToken } = getAuthTokens();
  if (refreshToken) {
    await authClient.post("/auth/logout", { refreshToken }).catch(() => undefined);
  }
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}
