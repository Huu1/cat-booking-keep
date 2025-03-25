import { request } from "@/utils/request";

// 获取所有账本
export const getBooks = () => {
  return request.get("/books");
};

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
