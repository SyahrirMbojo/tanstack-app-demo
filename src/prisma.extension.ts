import { Prisma } from "./generated/prisma/client.js";

export type MetaModel = {
  total: number;
  per_page: number;
  skip: number;
  current_page: number;
  last_page: number;
  total_page: number;
};

export type PaginatedResult<TData> = {
  data: TData;
  meta: MetaModel;
};

type PaginationArgs = {
  where?: unknown;
  skip?: number;
  take?: number;
  [key: string]: unknown;
};

function normalizePage(page: number | undefined) {
  if (!page || Number.isNaN(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

function normalizeLimit(limit: number | undefined) {
  if (!limit || Number.isNaN(limit) || limit < 1) {
    return 10;
  }

  return Math.floor(limit);
}

export default Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      $allModels: {
        async softDelete<T>(this: T, id: number) {
          const model = Prisma.getExtensionContext(this) as any;

          return await model.update({
            where: { id },
            data: { deletedAt: new Date() },
          });
        },

        async findManyPaginate<T>(
          this: T,
          page?: number,
          limit?: number,
          args?: PaginationArgs,
        ): Promise<PaginatedResult<any[]>> {
          const model = Prisma.getExtensionContext(this) as any;

          const currentPage = normalizePage(page);
          const perPage = normalizeLimit(limit);
          const skip = perPage * (currentPage - 1);
          const total = await model.count({
            where: args?.where,
          });
          const lastPage = Math.max(1, Math.ceil(total / perPage));
          const data =
            currentPage > lastPage
              ? []
              : await model.findMany({
                  ...args,
                  skip,
                  take: perPage,
                });

          return {
            data,
            meta: {
              total,
              per_page: perPage,
              skip,
              current_page: currentPage,
              last_page: lastPage,
              total_page: lastPage,
            },
          };
        },
      },
    },
  });
});
