import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/permissions/guards/permissions.guard';
import { Permissions } from 'src/permissions/decorators/permissions.decorator';

@Controller('users')
@UseGuards(AuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Permissions('users_create')
  async create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  @Permissions('users_getAll')
  async getAll() {
    return this.userService.getAllUsers();
  }
}
