import { prisma } from "#/db";
import { createServerFn } from "@tanstack/react-start";

export const getTodos = createServerFn({
  method: "GET",
}).handler(async () => {
  return await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
});

export const createTodo = createServerFn({
  method: "POST",
})
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    return await prisma.todo.create({
      data,
    });
  });

export const countTodos = createServerFn({
  method: "GET",
}).handler(async () => {
  return await prisma.todo.count();
});
