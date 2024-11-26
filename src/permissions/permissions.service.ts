import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PERMISSIONS } from './seed/permissions.seed';
import * as bcrypt from 'bcrypt';
import { MODULE_ACCESS } from 'src/module-access/seed/moduleAccess.seed';
// import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedModuleAccess();
    await this.seedPermissions();
    await this.seedMasterGroup();
    await this.seedRoles();
    await this.seedAdminUser();
  }

  // 1. Criar Acesso de Módulo no banco
  private async seedModuleAccess() {
    for (const moduleAccess of MODULE_ACCESS) {
      const exists = await this.prisma.moduleAccess.findUnique({
        where: { moduleName: moduleAccess.moduleName },
      });
      if (!exists) {
        await this.prisma.moduleAccess.create({
          data: moduleAccess,
        });
        console.log(`Created moduleAccess: ${moduleAccess.moduleName}`);
      }
    }
  }

  // 2. Criar permissões no banco
  private async seedPermissions() {
    for (const permission of PERMISSIONS) {
      const exists = await this.prisma.permission.findUnique({
        where: { code_name: permission.code_name },
      });

      if (!exists) {
        // Resolva o módulo de acesso
        const moduleAccess = await this.prisma.moduleAccess.findUnique({
          where: { moduleName: permission.moduleAccess },
        });

        if (!moduleAccess) {
          console.error(
            `ModuleAccess "${permission.moduleAccess}" not found for permission "${permission.code_name}".`,
          );
          continue;
        }

        // Resolva o parent, se houver
        const parent = permission.parent
          ? await this.prisma.permission.findUnique({
              where: { code_name: permission.parent },
            })
          : null;

        // Crie a permissão
        await this.prisma.permission.create({
          data: {
            name: permission.name,
            description: permission.description,
            code_name: permission.code_name,
            parentId: parent?.id || null,
            moduleAccessId: moduleAccess.id,
          },
        });

        console.log(`Created permission: ${permission.name}`);
      }
    }
  }

  // 3. Criar grupo "Master" com todas as permissões
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

  // 4. Criar roles "Developer", "Management" e "User"
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

  // 5. Criar usuário "AzunaCare" com role "Developer" e grupo "Master"
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
