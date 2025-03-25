import { request } from "@/utils/request";

// 创建账户
export const addAccount = (params) => {
  return request.post(`/accounts/from-template`, params);
};

// 更新账户
export const updateAccount = (params) => {
  return request.post(`/accounts/${params.id}/update`, params);
};

// 获取账户详情
export const getAccount = (id:any) => {
  return request.get(`/accounts/${id}`);
};


// 获取全部账户
export const getAccountList = () => {
  return request.get(`/accounts/list`);
};
