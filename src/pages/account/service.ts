import { request } from "@/utils/request";

export const getAccounts = () =>
  request.get("/accounts", {});

export const getAccountsSummary = () =>
  request.get("/accounts/assets/summary", {});


