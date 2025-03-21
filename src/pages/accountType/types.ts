export interface Template {
  id: number;
  name: string;
  icon: string;
  description: string;
  type: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

export interface AccountGroupType {
  title: string;
  type: string;
  templates: Template[];
}