import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
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
  @Permissions('config_registerUsers_users_create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  @Permissions('config_registerUsers_users_view')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.userService.getAllUsers();
  }

  @Post('/permissions')
  @HttpCode(HttpStatus.OK)
  async getPermissions(@Body('userId') userId: number) {
    console.log(userId);
    return this.userService.getPermissions(userId);
  }
}
