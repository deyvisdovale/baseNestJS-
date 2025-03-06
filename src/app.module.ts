import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionsModule } from './configuration/register-users/permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { GroupModule } from './group/group.module';

@Module({
  imports: [AuthModule, UsersModule, PermissionsModule, GroupModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
