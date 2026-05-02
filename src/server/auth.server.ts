import { prisma } from "#/db";
import bcrypt from "bcryptjs";

export interface AuthUser {
  id: number;
  uuid: string;
  name: string;
  email: string | null;
  username: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(data: {
  name: string;
  username: string;
  password: string;
  email?: string;
  gender?: string;
  phone?: string;
  address?: string;
}): Promise<AuthUser> {
  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      gender: data.gender!,
      phone: data.phone,
      address: data.address,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    username: user.username,
  };
}

export async function getUserByUsername(
  username: string,
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    username: user.username,
  };
}

export async function getUserById(id: number): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    username: user.username,
  };
}

export async function authenticateUser(
  username: string,
  password: string,
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    username: user.username,
  };
}
