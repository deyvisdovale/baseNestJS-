export class CreateGroupDto {
  name: string;
}

export class UpdateGroupDto {
  id: number;
  name: string;
}

export class UpdateGroupPermissionsDto {
  groupId: number;
  permissions: number[];
}
