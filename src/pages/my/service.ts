import { request } from "@/utils/request";


// 添加账本
export const updateUser = (data) => {
  return request.post("/users/profile", data);
};
