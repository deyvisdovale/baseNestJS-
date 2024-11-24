import { Controller, Post, Body, Get } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() dto: CreateGroupDto) {
    return this.groupService.createGroup(dto);
  }

  @Get()
  async getAll() {
    return this.groupService.getAllGroups();
  }
}
