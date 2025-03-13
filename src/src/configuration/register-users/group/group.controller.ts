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
import { GroupService } from './group.service';
import {
  CreateGroupDto,
  UpdateGroupDto,
  UpdateGroupPermissionsDto,
} from './dto/group.dto';
import { PermissionsGuard } from 'src/configuration/register-users/permissions/guards/permissions.guard';
import { Permissions } from 'src/configuration/register-users/permissions/decorators/permissions.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PermissionsService } from '../permissions/permissions.service';

@Controller('groups')
@UseGuards(AuthGuard, PermissionsGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Post()
  @Permissions('config_registerUsers_group_create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGroupDto) {
    return this.groupService.createGroup(dto);
  }

  @Get()
  @Permissions('config_registerUsers_group_view')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.groupService.getAllGroups();
  }

  @Put()
  @Permissions('config_registerUsers_group_update')
  @HttpCode(HttpStatus.OK)
  async update(@Body() dto: UpdateGroupDto) {
    return this.groupService.updateGroup(dto);
  }

  @Put('/permissions')
  @Permissions('config_registerUsers_group_update')
  @HttpCode(HttpStatus.OK)
  async updatePermissions(@Body() dto: UpdateGroupPermissionsDto) {
    return this.groupService.updateGroupPermissions(dto);
  }

  @Get('/usersGroups')
  @Permissions(
    'config_registerUsers_users_create',
    'config_registerUsers_users_update',
  )
  @HttpCode(HttpStatus.OK)
  async getAllSelectorsGroups() {
    return this.groupService.getAllSelectorGroups();
  }

  @Get('/permissions')
  @Permissions(
    'config_registerUsers_group_create',
    'config_registerUsers_group_update',
  )
  @HttpCode(HttpStatus.OK)
  async getAllPermissions() {
    return this.permissionsService.getAllPermissions();
  }
}
