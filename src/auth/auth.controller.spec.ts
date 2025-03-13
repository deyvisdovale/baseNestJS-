import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/configuration/register-users/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core'; // Importe o Reflector
import { PermissionsService } from 'src/configuration/register-users/permissions/permissions.service';
import { PermissionsGuard } from 'src/configuration/register-users/permissions/guards/permissions.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn().mockResolvedValue({ access_token: 'mockToken' }), // Mock da função signIn
          },
        },
        {
          provide: UsersService,
          useValue: {}, // Mock do UsersService
        },
        {
          provide: JwtService,
          useValue: {}, // Mock do JwtService
        },
        {
          provide: PrismaService,
          useValue: {}, // Mock do PrismaService
        },
        {
          provide: PermissionsService,
          useValue: {}, // Mock do PermissionsService
        },
        {
          provide: Reflector,
          useValue: {}, // Mock do Reflector
        },
        {
          provide: PermissionsGuard,
          useValue: {}, // Mock do PermissionsGuard
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token when credentials are valid', async () => {
      const signInDto = { username: 'testuser', password: 'testpassword' };

      // Chama a função signIn do controller
      const result = await authController.signIn(signInDto);

      // Verifica se o resultado é o esperado
      expect(result).toEqual({ access_token: 'mockToken' });
    });

    it('should throw an error when credentials are invalid', async () => {
      const signInDto = { username: 'testuser', password: 'wrongpassword' };

      // Mock do AuthService para lançar um erro
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      // Verifica se a função signIn do controller lança um erro
      await expect(authController.signIn(signInDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
