import { request } from "@/utils/request";

export const getCategories = (type = "expense") => {
  return request.get(`/categories?type=${type}`);
};

export const saveRecord = (params: {
  amount: number;
  categoryId: number;
  note: string;
  accountId: number;
  type: string;
  bookId: number;
  recordDate:string;
}) => {
  return request.post(`/records`, params);
};
