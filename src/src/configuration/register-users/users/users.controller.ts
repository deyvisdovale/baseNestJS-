import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateResetPassUserDto,
  UpdateUserDto,
} from './dto/users.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/configuration/register-users/permissions/guards/permissions.guard';
import { Permissions } from 'src/configuration/register-users/permissions/decorators/permissions.decorator';

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
  @Put()
  @Permissions('config_registerUsers_users_update')
  @HttpCode(HttpStatus.OK)
  async update(@Body() dto: UpdateUserDto) {
    return this.userService.updateUser(dto);
  }
  @Put('/reset')
  @Permissions('config_registerUsers_users_update')
  @HttpCode(HttpStatus.OK)
  async updateResetPassword(@Body() dto: UpdateResetPassUserDto) {
    return this.userService.resetPassUser(dto);
  }

  @Post('/permissions')
  @HttpCode(HttpStatus.OK)
  async getPermissions(@Body('userId') userId: number) {
    return this.userService.getPermissions(userId);
  }
}
