import { PAGINATION } from '../config/constants';

interface PaginationParams {
  page?: number | string;
  limit?: number | string;
}

interface SqlPagination {
  limit: number;
  offset: number;
}

export const getPagination = ({ page, limit }: PaginationParams): SqlPagination => {
  const parsedPage = Math.max(1, parseInt(String(page), 10) || PAGINATION.DEFAULT_PAGE);
  const parsedLimit = Math.max(1, parseInt(String(limit), 10) || PAGINATION.DEFAULT_LIMIT);

  const safeLimit = Math.min(parsedLimit, PAGINATION.MAX_LIMIT);
  const offset = (parsedPage - 1) * safeLimit;

  return {
    limit: safeLimit,
    offset,
  };
};

export const applyPagination = (baseSql: string, pagination: SqlPagination): string => {
  return `${baseSql} LIMIT ${pagination.limit} OFFSET ${pagination.offset}`;
};
