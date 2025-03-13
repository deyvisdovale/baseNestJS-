import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import {
  CreateGroupDto,
  UpdateGroupDto,
  UpdateGroupPermissionsDto,
} from './dto/group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(dto: CreateGroupDto) {
    // Verifica se o name do grupo já existe
    const existingGroup = await this.prisma.group.findUnique({
      where: { name: dto.name },
    });
    if (existingGroup) {
      throw new HttpException(
        'O nome do grupo já está em uso.',
        HttpStatus.CONFLICT,
      );
    }
    return await this.prisma.group.create({
      data: {
        name: dto.name,
      },
    });
  }
  async updateGroup(dto: UpdateGroupDto) {
    const existingGroup = await this.prisma.group.findFirst({
      where: {
        name: dto.name,
        id: { not: dto.id }, // Garante que não seja o próprio grupo
      },
    });
    if (existingGroup) {
      throw new HttpException(
        'O nome do grupo já está em uso por outro grupo.',
        HttpStatus.CONFLICT,
      );
    }
    return await this.prisma.group.update({
      where: { id: dto.id },
      data: {
        name: dto.name,
      },
    });
  }

  async getAllGroups() {
    return await this.prisma.group.findMany({
      include: {
        permissions: true,
      },
    });
  }

  async getAllSelectorGroups() {
    return await this.prisma.group.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async updateGroupPermissions(dto: UpdateGroupPermissionsDto) {
    const group = await this.prisma.group.findUnique({
      where: { id: dto.groupId },
    });
    if (!group) {
      throw new HttpException('Grupo não encontrado.', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.group.update({
      where: { id: dto.groupId },
      data: {
        permissions: {
          set: dto.permissions.map((permission) => ({ id: permission })),
        },
      },
    });
  }
}
