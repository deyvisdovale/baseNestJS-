import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../permissions.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { MODULE_ACCESS_KEY } from 'src/module-access/decorators/module-access.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('PermissionsGuard');
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredModuleAccess = this.reflector.getAllAndOverride<string[]>(
      MODULE_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('### User Permissions ###');
    console.log(user);

    const userFind = await this.usersService.getPermissions(user.sub);
    if (!userFind) {
      throw new NotFoundException('Not Found user in permissions.');
    }

    // Always allow Developers to access any route
    if (userFind.role?.name == 'Developer') {
      console.log('Developer');
      return true;
    }

    const hasModuleAccess =
      await this.permissionsService.hasModuleAccess(requiredModuleAccess);
    if (!hasModuleAccess) {
      throw new ForbiddenException('You do not have access to this module');
    }
    // Management role should check for module access
    if (userFind.role?.name == 'Management') {
      console.log('Management');
      return true;
    }

    console.log(requiredPermissions);
    console.log('Antes do IF');

    // Users should check for specific permissions
    if (requiredPermissions) {
      const hasPermissions = userFind.group?.permissions.some((permission) =>
        requiredPermissions.some(
          (reqPermission) => permission.code_name === reqPermission,
        ),
      );

      console.log(hasPermissions);
      if (!hasPermissions) {
        throw new ForbiddenException(
          'You do not have the required permissions',
        );
      }
    }

    return true;
  }
}
