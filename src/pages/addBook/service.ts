import { request } from "@/utils/request";

// 添加账本
export const addBook = (data) => {
  return request.post("/books", data);
};

// 更新账本
export const updateBook = (data) => {
  return request.post(`/books/${data.id}/update`, data);
};

// 获取账本详情
export const getBookDetail = (bookId: number) => {
  return request.get(`/books/${bookId}`);
};

// 获取账本详情
export const getBookimages = () => {
  return request.get(`/dict-items/code/bookImage`);
};
