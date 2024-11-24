import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PERMISSIONS } from './seed/permissions.seed';
import * as bcrypt from 'bcrypt';
// import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedPermissions();
    await this.seedMasterGroup();
    await this.seedRoles();
    await this.seedAdminUser();
  }

  // 1. Criar permissões no banco
  private async seedPermissions() {
    for (const permission of PERMISSIONS) {
      const exists = await this.prisma.permission.findUnique({
        where: { name: permission.name },
      });
      if (!exists) {
        await this.prisma.permission.create({
          data: permission,
        });
        console.log(`Created permission: ${permission.name}`);
      }
    }
  }

  // 2. Criar grupo "Master" com todas as permissões
  private async seedMasterGroup() {
    const permissions = await this.prisma.permission.findMany();

    const masterGroupExists = await this.prisma.group.findUnique({
      where: { name: 'Master' },
    });

    if (!masterGroupExists) {
      await this.prisma.group.create({
        data: {
          name: 'Master',
          permissions: {
            connect: permissions.map((permission) => ({ id: permission.id })),
          },
        },
      });
      console.log('Created Master group with all permissions');
    }
  }

  // 3. Criar roles "Developer", "Management" e "User"
  private async seedRoles() {
    const roles = ['Developer', 'Management', 'User'];

    for (const role of roles) {
      const roleExists = await this.prisma.role.findUnique({
        where: { name: role },
      });

      if (!roleExists) {
        await this.prisma.role.create({
          data: { name: role },
        });
        console.log(`Created role: ${role}`);
      }
    }
  }

  // 4. Criar usuário "AzunaCare" com role "Developer" e grupo "Master"
  private async seedAdminUser() {
    const masterGroup = await this.prisma.group.findUnique({
      where: { name: 'Master' },
    });

    const developerRole = await this.prisma.role.findUnique({
      where: { name: 'Developer' },
    });

    if (!masterGroup || !developerRole) {
      console.error('Master group or Developer role not found');
      return;
    }

    const userExists = await this.prisma.user.findUnique({
      where: { username: 'AzunaCare' },
    });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash('12345678', 10);
      await this.prisma.user.create({
        data: {
          name: 'Azuna LTDA',
          username: 'AzunaCare',
          email: 'azunacare@example.com',
          password: hashedPassword,
          roleId: developerRole.id,
          groupId: masterGroup.id,
        },
      });
      console.log('Created admin user: AzunaCare');
    }
  }

  /**
   * Verifica se o usuário tem acesso ao módulo requisitado
   * @param requiredModuleAccess Nome dos módulos requeridos
   * @returns boolean
   */
  async hasModuleAccess(requiredModuleAccess: string[]): Promise<boolean> {
    if (!requiredModuleAccess || requiredModuleAccess.length === 0) {
      return true; // Nenhum módulo requerido, acesso permitido
    }

    // Simula busca do módulo no banco (exemplo, pode ser ajustado ao seu schema)
    const moduleAccess = await this.prisma.moduleAccess.findMany({
      where: { moduleName: { in: requiredModuleAccess }, hasAccess: true },
    });

    console.log('Module Access:', moduleAccess);

    return moduleAccess.length > 0;
  }

  /**
   * Verifica se o usuário possui todas as permissões requisitadas
   * @param userPermissions Permissões do usuário
   * @param requiredPermissions Permissões requeridas
   * @returns boolean
   */
  async hasPermissions(
    userPermissions: string[],
    requiredPermissions: string[],
  ): Promise<boolean> {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // Nenhuma permissão requerida, acesso permitido
    }

    // Verifica se todas as permissões requeridas estão nas permissões do usuário
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    console.log('Required Permissions:', requiredPermissions);
    console.log('User Permissions:', userPermissions);
    console.log('Has All Permissions:', hasAllPermissions);

    return hasAllPermissions;
  }
}
