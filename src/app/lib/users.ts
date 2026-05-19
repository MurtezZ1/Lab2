import { cookies } from "next/headers";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export type StoreUser = {
  id: number;
  email: string;
  username: string;
  password: string;
  role: string;
  active: number;
};

export type CreateUserInput = {
  email: string;
  username: string;
  password: string;
};

const fallbackUsersPath = path.join(process.cwd(), "src", "app", "data", "users.json");

const getFallbackUsers = async () => {
  const users = await readFile(fallbackUsersPath, "utf-8");
  return JSON.parse(users) as StoreUser[];
};

const saveFallbackUsers = async (users: StoreUser[]) => {
  await writeFile(fallbackUsersPath, `${JSON.stringify(users, null, 2)}\n`);
};

const normalizeUser = (user: StoreUser): StoreUser => ({
  id: user.id,
  email: user.email,
  username: user.username,
  password: user.password,
  role: user.role,
  active: user.active,
});

export async function getUserByCredentials(email: string, password: string) {
  try {
    const user = await prisma.users.findFirst({
      where: { email, password },
    });

    return user ? normalizeUser(user) : null;
  } catch {
    const fallbackUsers = await getFallbackUsers();

    return (
      fallbackUsers.find(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase() &&
          user.password === password,
      ) ?? null
    );
  }
}

export async function createUser(input: CreateUserInput) {
  try {
    const user = await prisma.users.create({
      data: {
        email: input.email,
        username: input.username,
        password: input.password,
        role: "user",
        active: 1,
        shopping_cart: {
          create: {},
        },
      },
    });

    return normalizeUser(user);
  } catch {
    const fallbackUsers = await getFallbackUsers();
    const fallbackUser: StoreUser = {
      id: Date.now(),
      email: input.email,
      username: input.username,
      password: input.password,
      role: "user",
      active: 1,
    };

    const existingFallbackUser = fallbackUsers.find(
      (user) =>
        user.email.toLowerCase() === input.email.toLowerCase() ||
        user.username.toLowerCase() === input.username.toLowerCase(),
    );

    if (existingFallbackUser) {
      throw new Error("A user with this email or username already exists.");
    }

    await saveFallbackUsers([...fallbackUsers, fallbackUser]);

    return fallbackUser;
  }
}

export async function getUserById(id: number) {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });

    return user ? normalizeUser(user) : null;
  } catch {
    const fallbackUsers = await getFallbackUsers();
    return fallbackUsers.find((user) => user.id === id) ?? null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sunspot_user_id")?.value;

  if (!userId) return null;

  const parsedUserId = Number(userId);

  if (!Number.isInteger(parsedUserId)) return null;

  const user = await getUserById(parsedUserId);

  if (user) return user;

  const email = cookieStore.get("sunspot_user_email")?.value;
  const username = cookieStore.get("sunspot_username")?.value;
  const role = cookieStore.get("sunspot_user_role")?.value ?? "user";

  if (!email || !username) return null;

  return {
    id: parsedUserId,
    email,
    username,
    password: "",
    role,
    active: 1,
  };
}
