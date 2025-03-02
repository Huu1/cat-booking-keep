import { request } from "@/utils/request";

export const getMonthlyStats = (month?:string) => request.get("/analysis/monthly-stats",{
  month
});
