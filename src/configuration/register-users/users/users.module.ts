import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PermissionsModule } from 'src/configuration/register-users/permissions/permissions.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
  imports: [PermissionsModule],
})
export class UsersModule {}
