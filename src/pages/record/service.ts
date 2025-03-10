import { request } from "@/utils/request";

export const getCategories = () => request.get("/categories", {});
