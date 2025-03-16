import {request} from '@/utils/request';

// 获取记录详情
export const getRecordDetail = (id: number) => {
  return request.get(`/records/${id}`);
};

// 删除记录
export const deleteRecord = (id: number) => {
  return request.post(`/records/${id}`);
};