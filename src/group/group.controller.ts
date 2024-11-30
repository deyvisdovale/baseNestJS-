import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/group.dto';
import { PermissionsGuard } from 'src/permissions/guards/permissions.guard';
import { Permissions } from 'src/permissions/decorators/permissions.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('groups')
@UseGuards(AuthGuard, PermissionsGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Permissions('create_group')
  async create(@Body() dto: CreateGroupDto) {
    return this.groupService.createGroup(dto);
  }

  @Get()
  @Permissions('view_groups')
  async getAll() {
    return this.groupService.getAllGroups();
  }

  @Get('/usersGroups')
  @Permissions(
    'config_registerUsers_users_create',
    'config_registerUsers_users_update',
  )
  async getAllSelectorsGroups() {
    return this.groupService.getAllSelectorGroups();
  }
}
