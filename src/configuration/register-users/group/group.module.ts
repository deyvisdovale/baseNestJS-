import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupController } from './group.controller';
import { PermissionsModule } from 'src/configuration/register-users/permissions/permissions.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PermissionsModule, UsersModule],
  controllers: [GroupController],
  providers: [GroupService, PrismaService],
  exports: [GroupService],
})
export class GroupModule {}
