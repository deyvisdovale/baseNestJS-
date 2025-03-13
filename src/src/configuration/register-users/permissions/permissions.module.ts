import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PermissionsService, PrismaService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
