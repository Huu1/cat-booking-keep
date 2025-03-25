import { request } from "@/utils/request";

export const getMonthlyStats = (
  type: "year" | "month" = "month",
  year: string,
  month?: string,
  bookId?: number
) =>
  request.get("/statistics", {
    type,
    year,
    month,
    bookId
  });

export const getDefaultBook = () => request.get("/books/default");

export const getMonthlyStatsDetail = (
  type: "year" | "month" = "month",
  year: string,
  month?: string,
  page: number = 1,
  pageSize: number = 10,
  bookId?: number
) =>
  request.get("/statistics/details", {
    type,
    year,
    month,
    includeRecords: true,
    page,
    pageSize,
    bookId
  });
