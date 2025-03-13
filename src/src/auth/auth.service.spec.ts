import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/configuration/register-users/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock do UsersService
const mockUsersService = {
  findOne: jest.fn(),
};

// Mock do JwtService
const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mockAccessToken'), // Retorna um token falso
};

describe('AuthService (Integration)', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should return an access token when credentials are valid', async () => {
    // Mocka a resposta de findOne para retornar um usuário com a senha correta
    mockUsersService.findOne.mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
    });

    // Mocka bcrypt para simular a comparação de senha
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);

    const result = await authService.signIn('testuser', 'testpassword');

    expect(result).toHaveProperty('access_token');
    expect(result.access_token).toBe('mockAccessToken'); // Verifica o token gerado
  });

  it('should throw an error when credentials are invalid', async () => {
    // Mocka a resposta de findOne para retornar null (usuário não encontrado)
    mockUsersService.findOne.mockResolvedValue(null);

    await expect(
      authService.signIn('testuser', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException); // Espera erro de credenciais inválidas
  });
});
