import { request } from "@/utils/request";

// 创建账户
export const addAccount = (params) => {
  return request.post(`/accounts/from-template`, params);
};
