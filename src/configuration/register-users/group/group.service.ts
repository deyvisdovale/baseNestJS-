import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        name: dto.name,
        permissions: {
          connect: dto.permissionIds.map((id) => ({ id })),
        },
      },
    });
  }

  async getAllGroups() {
    return this.prisma.group.findMany({
      include: {
        permissions: true,
      },
    });
  }

  async getAllSelectorGroups() {
    return this.prisma.group.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}
