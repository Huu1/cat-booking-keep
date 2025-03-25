import { iconGroups, iconList } from "@/components/Iconfont/iconList";

// 自定义Hook，用于获取所有图标或特定分组的图标
export const getIcons = (group?: string) => {
  // 如果指定了分组，则获取该分组的图标，否则获取所有图标
  return group && iconGroups[group] ? iconGroups[group] : iconList;
};
