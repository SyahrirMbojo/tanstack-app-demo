import { createServerFn } from "@tanstack/react-start";
import { authenticateUser, createUser } from "./auth.server";
import {
  clearAuthSession,
  getAuthSessionUser,
  setAuthSession,
} from "./session.server";

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  username: string;
  email?: string;
  password: string;
  confirmPassword?: string;
  gender?: string;
  phone?: string;
  address?: string;
}

export interface AuthUser {
  id: number;
  uuid: string;
  name: string;
  email: string | null;
  username: string;
}

export const getCurrentUser = createServerFn({
  method: "GET",
}).handler(async () => {
  return getAuthSessionUser();
});

export const loginUser = createServerFn({
  method: "POST",
})
  .inputValidator((data: LoginInput) => data)
  .handler(async ({ data }) => {
    if (!data.username || !data.password) {
      throw new Error("Username dan password harus diisi");
    }

    const user = await authenticateUser(data.username, data.password);
    if (!user) {
      throw new Error("Username atau password salah");
    }

    await setAuthSession(user);

    return user;
  });

export const registerUser = createServerFn({
  method: "POST",
})
  .inputValidator((data: RegisterInput) => data)
  .handler(async ({ data }) => {
    if (!data.name || !data.username || !data.password) {
      throw new Error("Name, username, dan password harus diisi");
    }

    if (data.password !== data.confirmPassword) {
      throw new Error("Password tidak cocok");
    }

    if (data.password.length < 6) {
      throw new Error("Password minimal 6 karakter");
    }

    try {
      const user = await createUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
      });

      await setAuthSession(user);

      return user;
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Username atau email sudah terdaftar");
      }
      throw error;
    }
  });

export const logoutUser = createServerFn({
  method: "POST",
}).handler(async () => {
  await clearAuthSession();
  return { success: true };
});
