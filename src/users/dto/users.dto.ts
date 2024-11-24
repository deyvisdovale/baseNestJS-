export class CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  roleId?: number;
  groupId?: number;
}
