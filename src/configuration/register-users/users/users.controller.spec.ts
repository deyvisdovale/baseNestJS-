import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { PermissionsService } from '../permissions/permissions.service';

const mockUsersService = {
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  updateUser: jest.fn(),
  getPermissions: jest.fn(),
};

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: {}, // Mock do JwtService
        },
        {
          provide: PermissionsGuard,
          useValue: {}, // Mock do PermissionsGuard
        },
        {
          provide: PermissionsService,
          useValue: {}, // Mock do PermissionsService
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'teste',
        email: 'teste@teste.com',
        birthDate: new Date().toDateString(),
        group: '1',
        isActive: true,
        password: 'pass',
        username: 'teste',
      };

      mockUsersService.createUser.mockResolvedValue(createUserDto);

      // Act
      const result = await usersController.create(createUserDto);

      // Assert
      expect(result).toEqual(createUserDto);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
    it('should handle errors when creating a user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'teste',
        email: 'teste@teste.com',
        birthDate: new Date().toDateString(),
        group: '1',
        isActive: true,
        password: 'pass',
        username: 'teste',
      };

      const errorMessage = 'Error creating user';
      mockUsersService.createUser.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(usersController.create(createUserDto)).rejects.toThrow(
        errorMessage,
      );
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      // Arrange
      const users = [
        {
          id: 1,
          name: 'teste',
          email: 'teste@teste.com',
          birthDate: new Date().toDateString(),
          group: '1',
          isActive: true,
          password: 'pass',
          username: 'teste',
        },
      ];

      mockUsersService.getAllUsers.mockResolvedValue(users);

      // Act
      const result = await usersController.getAll();

      // Assert
      expect(result).toEqual(users);
      expect(mockUsersService.getAllUsers).toHaveBeenCalled();
    });
    it('should handle errors when fetching all users', async () => {
      // Arrange
      const errorMessage = 'Error fetching users';
      mockUsersService.getAllUsers.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(usersController.getAll()).rejects.toThrow(errorMessage);
      expect(mockUsersService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        id: 1,
        name: 'teste atualizado',
        email: 'teste@teste.com',
        birthDate: new Date().toDateString(),
        group: '1',
        isActive: true,
        password: 'pass',
        username: 'teste',
      };

      mockUsersService.updateUser.mockResolvedValue(updateUserDto);

      // Act
      const result = await usersController.update(updateUserDto);

      // Assert
      expect(result).toEqual(updateUserDto);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(updateUserDto);
    });
    it('should handle errors when updating a user', async () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        id: 1,
        name: 'teste atualizado',
        email: 'teste@teste.com',
        birthDate: new Date().toDateString(),
        group: '1',
        isActive: true,
        password: 'pass',
        username: 'teste',
      };

      const errorMessage = 'Error updating user';
      mockUsersService.updateUser.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(usersController.update(updateUserDto)).rejects.toThrow(
        errorMessage,
      );
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(updateUserDto);
    });
  });

  describe('getPermissions', () => {
    it('should return user permissions', async () => {
      // Arrange
      const userId = 1;
      const permissions = ['config_registerUsers_users_view'];

      mockUsersService.getPermissions.mockResolvedValue(permissions);

      // Act
      const result = await usersController.getPermissions(userId);

      // Assert
      expect(result).toEqual(permissions);
      expect(mockUsersService.getPermissions).toHaveBeenCalledWith(userId);
    });
    it('should handle errors when fetching user permissions', async () => {
      // Arrange
      const userId = 1;
      const errorMessage = 'Error fetching permissions';
      mockUsersService.getPermissions.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(usersController.getPermissions(userId)).rejects.toThrow(
        errorMessage,
      );
      expect(mockUsersService.getPermissions).toHaveBeenCalledWith(userId);
    });
  });
});
