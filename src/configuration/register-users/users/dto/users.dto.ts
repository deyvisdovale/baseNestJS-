export class CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  group: string;
  birthDate: string;
  isActive: boolean;
}

export class UpdateUserDto {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  group: string;
  birthDate: string;
  isActive: boolean;
}
