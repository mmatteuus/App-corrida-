import { Request, Response } from 'express';
import { CreateUserSchema, LoginSchema } from '@conexao-ativa/shared';
import { hashPassword, comparePassword, generateTokens } from '../utils/auth';
import prisma from '../utils/database';
import logger from '../utils/logger';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, neighborhood } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Usuário já existe com este email'
      });
    }

    // Hash da senha
    const passwordHash = await hashPassword(password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        neighborhood
      },
      select: {
        id: true,
        email: true,
        name: true,
        neighborhood: true,
        reputation: true,
        createdAt: true
      }
    });

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email
    });

    logger.info('User created successfully', { userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: {
        user,
        token: accessToken,
        refreshToken
      }
    });
  } catch (error) {
    logger.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        neighborhood: true,
        reputation: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email
    });

    // Remover hash da senha da resposta
    const { passwordHash, ...userWithoutPassword } = user;

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: accessToken,
        refreshToken
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

