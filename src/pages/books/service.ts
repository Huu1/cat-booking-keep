import { request } from "@/utils/request";

// 获取所有账本
export const getBooks = () => {
  return request.get("/books");
};

// 设置默认账本
export const setDefaultBookApi = (bookId: number) => {
  return request.post(`/books/${bookId}/default`);
};

// 更新账本
export const deleteBook = (id: number) => {
  return request.post(`/books/${id}/delete`);
};
