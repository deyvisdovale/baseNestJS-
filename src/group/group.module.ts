import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupController } from './group.controller';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [PermissionsModule],
  controllers: [GroupController],
  providers: [GroupService, PrismaService],
  exports: [GroupService],
})
export class GroupModule {}
