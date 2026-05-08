import { prisma } from "#/db";
import { createServerFn } from "@tanstack/react-start";
import { hashPassword } from "#/server/auth.server";

export type UserTableRow = {
  id: number;
  uuid: string;
  name: string;
  gender: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserFormInput = {
  id?: number;
  name: string;
  gender: string;
  phone?: string;
  email?: string;
  address?: string;
  username: string;
  password?: string;
};

type ListUsersInput = {
  page?: number;
  pageSize?: number;
  q?: string;
};

function nullableText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function validateUserForm(data: UserFormInput, mode: "create" | "update") {
  const name = data.name.trim();
  const gender = data.gender.trim();
  const username = data.username.trim();
  const email = nullableText(data.email);
  const phone = nullableText(data.phone);
  const address = nullableText(data.address);
  const password = data.password?.trim();

  if (!name || !gender || !username) {
    throw new Error("Nama, gender, dan username wajib diisi");
  }

  if (mode === "create" && !password) {
    throw new Error("Password wajib diisi");
  }

  if (password && password.length < 6) {
    throw new Error("Password minimal 6 karakter");
  }

  return {
    name,
    gender,
    username,
    email,
    phone,
    address,
    password,
  };
}

export const listUsers = createServerFn({
  method: "GET",
})
  .inputValidator((data: ListUsersInput) => data)
  .handler(async ({ data }) => {
    const q = data.q?.trim() ?? "";
    const where = {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { username: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { phone: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const result = await prisma.user.findManyPaginate(
      data.page,
      data.pageSize,
      {
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          uuid: true,
          name: true,
          gender: true,
          phone: true,
          email: true,
          address: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    );

    return {
      users: result.data,
      pagination: result.meta,
    };
  });

export const getUserRecord = createServerFn({
  method: "GET",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    if (!data.id) {
      throw new Error("User tidak valid");
    }

    return await prisma.user.findFirst({
      where: {
        id: data.id,
        deletedAt: null,
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        gender: true,
        phone: true,
        email: true,
        address: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

export const createUserRecord = createServerFn({
  method: "POST",
})
  .inputValidator((data: UserFormInput) => data)
  .handler(async ({ data }) => {
    const user = validateUserForm(data, "create");

    try {
      return await prisma.user.create({
        data: {
          name: user.name,
          gender: user.gender,
          phone: user.phone,
          email: user.email,
          address: user.address,
          username: user.username,
          password: await hashPassword(user.password!),
        },
        select: { id: true },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Username atau email sudah digunakan");
      }

      throw error;
    }
  });

export const updateUserRecord = createServerFn({
  method: "POST",
})
  .inputValidator((data: UserFormInput) => data)
  .handler(async ({ data }) => {
    if (!data.id) {
      throw new Error("User tidak valid");
    }

    const user = validateUserForm(data, "update");

    try {
      return await prisma.user.update({
        where: { id: data.id, deletedAt: null },
        data: {
          name: user.name,
          gender: user.gender,
          phone: user.phone,
          email: user.email,
          address: user.address,
          username: user.username,
          ...(user.password
            ? { password: await hashPassword(user.password) }
            : {}),
        },
        select: { id: true },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Username atau email sudah digunakan");
      }

      throw error;
    }
  });

export const deleteUserRecord = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    if (!data.id) {
      throw new Error("User tidak valid");
    }

    return await prisma.user.softDelete(data.id);
  });

export const countUsers = createServerFn({
  method: "GET",
}).handler(async () => {
  return await prisma.user.count({
    where: { deletedAt: null },
  });
});
