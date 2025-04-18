import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PERMISSIONS } from './seed/permissions.seed';
import * as bcrypt from 'bcrypt';
import { MODULE_ACCESS } from 'src/configuration/register-users/module-access/seed/moduleAccess.seed';
import { Permission } from '@prisma/client';
import { PermissionTree } from './dto/permissions.dto';

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
      await this.prisma.moduleAccess.upsert({
        where: { moduleName: moduleAccess.moduleName },
        update: moduleAccess, // Atualiza os dados existentes
        create: moduleAccess, // Cria um novo registro se não existir
      });
      console.log(`Seeded moduleAccess: ${moduleAccess.moduleName}`);
    }
  }

  // 2. Criar permissões no banco
  private async seedPermissions() {
    for (const permission of PERMISSIONS) {
      const moduleAccess = await this.prisma.moduleAccess.findUnique({
        where: { moduleName: permission.moduleAccess },
      });

      if (!moduleAccess) {
        console.error(
          `ModuleAccess "${permission.moduleAccess}" not found for permission "${permission.code_name}".`,
        );
        continue;
      }

      const parent = permission.parent
        ? await this.prisma.permission.findUnique({
            where: { code_name: permission.parent },
          })
        : null;

      await this.prisma.permission.upsert({
        where: { code_name: permission.code_name },
        update: {
          name: permission.name,
          description: permission.description,
          parentId: parent?.id || null,
          moduleAccessId: moduleAccess.id,
        },
        create: {
          name: permission.name,
          description: permission.description,
          code_name: permission.code_name,
          parentId: parent?.id || null,
          moduleAccessId: moduleAccess.id,
        },
      });

      console.log(`Seeded permission: ${permission.name}`);
    }
  }

  // 3. Criar grupo "Master" com todas as permissões
  private async seedMasterGroup() {
    const permissions = await this.prisma.permission.findMany();

    await this.prisma.group.upsert({
      where: { name: 'Master' },
      update: {
        permissions: {
          set: permissions.map((permission) => ({ id: permission.id })), // Atualiza o relacionamento
        },
      },
      create: {
        name: 'Master',
        permissions: {
          connect: permissions.map((permission) => ({ id: permission.id })),
        },
      },
    });

    console.log('Seeded Master group with all permissions');
  }

  // 4. Criar roles "Developer", "Management" e "User"
  private async seedRoles() {
    const roles = ['Developer', 'Management', 'User'];

    for (const role of roles) {
      await this.prisma.role.upsert({
        where: { name: role },
        update: {}, // Se necessário, inclua campos para atualização
        create: { name: role },
      });
      console.log(`Seeded role: ${role}`);
    }
  }

  // 5. Criar usuário "udi" com role "Developer" e grupo "Master"
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

    const hashedPassword = await bcrypt.hash('12345678', 10);

    await this.prisma.user.upsert({
      where: { username: 'azuna' },
      update: {
        name: 'Azuna System',
        email: 'azunasystem@gmail.com',
        password: hashedPassword,
        roleId: developerRole.id,
        groupId: masterGroup.id,
      },
      create: {
        name: 'Azuna System',
        username: 'azuna',
        email: 'azunasystem@gmail.com',
        password: hashedPassword,
        roleId: developerRole.id,
        groupId: masterGroup.id,
      },
    });

    console.log('Seeded admin user: Azuna');
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
  hasPermissions(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // Nenhuma permissão requerida, acesso permitido
    }

    // Verifica se todas as permissões requeridas estão nas permissões do usuário
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }

  async getAllPermissions(): Promise<PermissionTree[]> {
    const permissions = await this.prisma.permission.findMany();
    return this.buildPermissionTree(permissions);
  }

  buildPermissionTree(permissions: Permission[]): PermissionTree[] {
    const permissionMap = new Map<number, PermissionTree>();

    // Criar o mapa de permissões
    permissions.forEach((permission) => {
      permissionMap.set(permission.id, {
        id: permission.id,
        name: permission.name,
        code_name: permission.code_name,
        description: permission.description,
        children: [],
        parentId: permission.parentId,
      });
    });

    const tree: PermissionTree[] = [];

    // Construir a hierarquia
    permissions.forEach((permission) => {
      if (permission.parentId) {
        const parent = permissionMap.get(permission.parentId);
        const current = permissionMap.get(permission.id);

        if (parent && current) {
          parent.children.push(current);
        }
      } else {
        tree.push(permissionMap.get(permission.id)!);
      }
    });

    // Ordenar as permissões de cada nível por nome
    tree.forEach((node) => {
      this.sortPermissions(node);
    });

    return tree;
  }

  // Função para ordenar as permissões por nome
  sortPermissions(node: PermissionTree) {
    node.children.sort((a, b) => a.name.localeCompare(b.name)); // Ordena os filhos

    // Ordena recursivamente os filhos
    node.children.forEach((child) => {
      this.sortPermissions(child);
    });
  }
}
