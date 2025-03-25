import { request } from "@/utils/request";

export const getAccountDetail = (id:number|string) =>
  request.get(`/accounts/${id}/detail`, {});


export const deleteAccount = (id:number|string) =>
  request.post(`/accounts/${id}/delete`, {});



