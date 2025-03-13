import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PermissionsModule } from 'src/configuration/register-users/permissions/permissions.module';
import { UsersModule } from 'src/configuration/register-users/users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    PermissionsModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
