import { prisma } from "#/db";
import { createServerFn } from "@tanstack/react-start";

export type TodoTableRow = {
  id: number;
  title: string;
  createdAt: Date;
};

export type TodoFormInput = {
  id?: number;
  title: string;
};

type ListTodosInput = {
  page?: number;
  pageSize?: number;
  q?: string;
};

function validateTodoForm(data: TodoFormInput) {
  const title = data.title.trim();

  if (!title) {
    throw new Error("Title wajib diisi");
  }

  return { title };
}

export const listTodos = createServerFn({
  method: "GET",
})
  .inputValidator((data: ListTodosInput) => data)
  .handler(async ({ data }) => {
    const q = data.q?.trim() ?? "";
    const where = q
      ? {
          title: {
            contains: q,
            mode: "insensitive" as const,
          },
        }
      : {};

    const result = await prisma.todo.findManyPaginate(
      data.page,
      data.pageSize,
      {
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
    );

    return {
      todos: result.data,
      pagination: result.meta,
    };
  });

export const createTodoRecord = createServerFn({
  method: "POST",
})
  .inputValidator((data: TodoFormInput) => data)
  .handler(async ({ data }) => {
    const todo = validateTodoForm(data);

    return await prisma.todo.create({
      data: todo,
      select: { id: true },
    });
  });

export const updateTodoRecord = createServerFn({
  method: "POST",
})
  .inputValidator((data: TodoFormInput) => data)
  .handler(async ({ data }) => {
    if (!data.id) {
      throw new Error("Todo tidak valid");
    }

    const todo = validateTodoForm(data);

    return await prisma.todo.update({
      where: { id: data.id },
      data: todo,
      select: { id: true },
    });
  });

export const deleteTodoRecord = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    if (!data.id) {
      throw new Error("Todo tidak valid");
    }

    return await prisma.todo.delete({
      where: { id: data.id },
    });
  });

export const countTodos = createServerFn({
  method: "GET",
}).handler(async () => {
  return await prisma.todo.count();
});
