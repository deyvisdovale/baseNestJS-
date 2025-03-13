export class CreatePermissionDto {
  name: string;
  description?: string;
}

export type PermissionTree = {
  id: number;
  name: string;
  code_name: string;
  description?: string | null;
  children: PermissionTree[];
  parentId: number | null;
};
