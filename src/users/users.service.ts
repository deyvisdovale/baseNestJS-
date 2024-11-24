import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        role: true,
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
}
