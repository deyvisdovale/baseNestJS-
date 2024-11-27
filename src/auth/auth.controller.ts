import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { PermissionsGuard } from 'src/permissions/guards/permissions.guard';
import { Permissions } from 'src/permissions/decorators/permissions.decorator';
import { Module_Access } from 'src/module-access/decorators/module-access.decorator';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    console.log(signInDto);
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('teste')
  @Module_Access('auth')
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('teste')
  @Module_Access('teste2')
  @Get('profile2')
  getProfile2(@Request() req: any) {
    return req.user;
  }
}
