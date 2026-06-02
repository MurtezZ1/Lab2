import type { User } from "@/types";

const USERS_KEY = "sunspot_users";
const CURRENT_USER_KEY = "sunspot_current_user";
const ACCESS_TOKEN_KEY = "sunspot_access_token";
const REFRESH_TOKEN_KEY = "sunspot_refresh_token";

const defaultUsers: User[] = [
  {
    id: 1,
    email: "admin@sunspot.com",
    username: "admin",
    password: "AdminPassword123!",
    role: "admin",
    active: 1,
  },
];

function getUsers() {
  const storedUsers = window.localStorage.getItem(USERS_KEY);
  if (!storedUsers) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  return JSON.parse(storedUsers) as User[];
}

function saveUsers(users: User[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
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

function issueLocalTokens(user: User) {
  const accessToken = `local-access-${user.id}-${Date.now()}`;
  const refreshToken = `local-refresh-${user.id}-${Date.now()}`;
  saveAuthTokens(accessToken, refreshToken);
  return { ...user, accessToken, refreshToken };
}

export function registerUser(input: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  if (!input.username || !input.email || !input.password || !input.confirmPassword) {
    throw new Error("Please fill in all register fields.");
  }
  if (input.password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (input.password !== input.confirmPassword) throw new Error("Passwords do not match.");

  const users = getUsers();
  const exists = users.some(
    (user) =>
      user.email.toLowerCase() === input.email.toLowerCase() ||
      user.username.toLowerCase() === input.username.toLowerCase(),
  );

  if (exists) throw new Error("A user with this email or username already exists.");

  const user: User = {
    id: Date.now(),
    email: input.email,
    username: input.username,
    password: input.password,
    role: "user",
    active: 1,
  };

  saveUsers([...users, user]);
  const sessionUser = issueLocalTokens(user);
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export function loginUser(input: { email: string; password: string }) {
  if (!input.email || !input.password) throw new Error("Please fill in both email and password.");
  const user = getUsers().find(
    (entry) =>
      entry.email.toLowerCase() === input.email.toLowerCase() &&
      entry.password === input.password,
  );
  if (!user) throw new Error("Invalid email or password.");
  const sessionUser = issueLocalTokens(user);
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export function logoutUser() {
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}
