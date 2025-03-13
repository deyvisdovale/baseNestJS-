import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionsModule } from './configuration/register-users/permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './configuration/register-users/users/users.module';
import { GroupModule } from './configuration/register-users/group/group.module';

@Module({
  imports: [AuthModule, UsersModule, PermissionsModule, GroupModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
