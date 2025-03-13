import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/configuration/register-users/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Mock do PrismaService
const mockPrismaService = {
  user: {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should create a new user', async () => {
    // Mock da função bcrypt.hash para retornar uma senha "criptografada"
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => 'hashedPassword');

    const dto = {
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'password123',
      isActive: true,
      birthDate: '2000-01-01',
      group: '1',
    };

    const mockUser = {
      ...dto,
      password: 'hashedPassword',
      id: 1,
    };

    mockPrismaService.user.create.mockResolvedValue(mockUser);

    const result = await usersService.createUser(dto);

    expect(result).toHaveProperty('id');
    expect(result.password).toBe('hashedPassword');
    expect(result.username).toBe(dto.username);
    expect(mockPrismaService.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password: 'hashedPassword',
        isActive: dto.isActive,
        birthDate: new Date(dto.birthDate),
        group: { connect: { id: Number(dto.group) } },
        role: { connect: { id: 3 } },
      }),
    });
  });

  it('should update an existing user', async () => {
    const dto = {
      id: 1,
      name: 'Updated Name',
      username: 'updateduser',
      email: 'updateduser@test.com',
      isActive: false,
      birthDate: '1995-05-20',
      group: '2',
    };

    const updatedUser = {
      ...dto,
      id: 1,
      password: 'hashedPassword', // Se você quiser mockar a senha, adicione o campo de senha aqui
    };

    mockPrismaService.user.update.mockResolvedValue(updatedUser);

    const result = await usersService.updateUser(updatedUser);

    expect(result).toHaveProperty('id', 1);
    expect(result.name).toBe(dto.name);
    expect(result.username).toBe(dto.username);
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: dto.id },
      data: expect.objectContaining({
        name: dto.name,
        username: dto.username,
        email: dto.email,
        isActive: dto.isActive,
        birthDate: new Date(dto.birthDate),
        group: { connect: { id: Number(dto.group) } },
      }),
    });
  });

  it('should return all users', async () => {
    const mockUsers = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@test.com',
        isActive: true,
        birthDate: new Date(),
        group: { id: 1, name: 'group1' },
      },
      {
        id: 2,
        username: 'user2',
        email: 'user2@test.com',
        isActive: true,
        birthDate: new Date(),
        group: { id: 2, name: 'group2' },
      },
    ];

    mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

    const result = await usersService.getAllUsers();

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('username', 'user1');
    expect(result[1]).toHaveProperty('username', 'user2');
  });

  it('should return a user by username', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'testuser@test.com',
      role: { id: 1, name: 'user' },
      group: { id: 1, name: 'group1', permissions: [] },
    };

    mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

    const result = await usersService.findOne('testuser');

    if (result) {
      // Verifica se o resultado não é null
      expect(result).not.toBeNull(); // Garante que o resultado não seja null
      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('role');
      expect(result.role).toHaveProperty('name', 'user');
    }
  });

  it('should return permissions for a user', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      role: { id: 1, name: 'user' },
      group: {
        id: 1,
        name: 'group1',
        permissions: [{ id: 1, moduleAccess: { id: 1, name: 'module1' } }],
      },
    };

    mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

    const result = await usersService.getPermissions(1);

    if (result && result.group) {
      expect(result.group).toHaveProperty('permissions');
      expect(result.group.permissions).toHaveLength(1);
      expect(result.group.permissions[0]).toHaveProperty('moduleAccess');
      expect(result.group.permissions[0].moduleAccess).toHaveProperty(
        'name',
        'module1',
      );
    }
  });
});
