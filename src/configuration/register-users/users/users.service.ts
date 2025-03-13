import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateResetPassUserDto,
  UpdateUserDto,
} from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    // Verifica se o username já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new HttpException(
        'O nome de usuário já está em uso.',
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        isActive: dto.isActive,
        birthDate: new Date(dto.birthDate),
        group: {
          connect: {
            id: Number(dto.group),
          },
        },
        role: {
          connect: {
            id: 3,
          },
        },
      },
    });
  }

  async updateUser(dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
        id: { not: dto.id }, // Garante que não seja o próprio usuário
      },
    });

    if (existingUser) {
      throw new HttpException(
        'O nome de usuário já está em uso por outro usuário.',
        HttpStatus.CONFLICT,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, ...updateData } = dto;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        birthDate: new Date(updateData.birthDate),
        group: {
          connect: {
            id: Number(updateData.group),
          },
        },
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        group: true,
      },
    });
  }

  async findOne(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username: username,
      },
      include: {
        role: true,
        group: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  async getPermissions(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: {
        role: true,
        group: {
          include: {
            permissions: {
              include: {
                moduleAccess: true,
              },
            },
          },
        },
      },
    });

    return user ? { ...user, password: '' } : null;
  }

  async resetPassUser(dto: UpdateResetPassUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        id: dto.id,
      },
    });

    if (!existingUser) {
      throw new HttpException(
        'Não foi possível encontrar o usuário',
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.update({
      where: { id: dto.id },
      data: {
        password: hashedPassword,
        inReset: true,
      },
    });
  }
}
