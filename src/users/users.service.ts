import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    console.log(dto);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        isActive: dto.isActive,
        birthDate: new Date(dto.birthDate), // Converte para Date, caso necessário
        group: {
          connect: {
            id: Number(dto.group), // Associa o grupo pelo ID
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

    if (user) {
      const userWithoutPassword = { ...user, password: '' };
      return userWithoutPassword;
    }

    return null;
  }
}
