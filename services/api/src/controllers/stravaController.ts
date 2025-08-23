import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../utils/database';
import logger from '../utils/logger';
import axios from 'axios';

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = process.env.STRAVA_REDIRECT_URI;

export const startStravaAuth = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    // Verificar se já tem conta Strava conectada
    const existingStrava = await prisma.stravaAccount.findUnique({
      where: { userId }
    });

    if (existingStrava) {
      return res.status(409).json({
        success: false,
        error: 'Conta Strava já conectada'
      });
    }

    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(STRAVA_REDIRECT_URI!)}&approval_prompt=force&scope=read,activity:read_all&state=${userId}`;

    res.json({
      success: true,
      data: {
        authUrl
      }
    });
  } catch (error) {
    logger.error('Start Strava auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const stravaCallback = async (req: Request, res: Response) => {
  try {
    const { code, state: userId, error } = req.query;

    if (error) {
      logger.warn('Strava auth denied:', { error, userId });
      return res.redirect(`${process.env.CORS_ORIGIN}/strava-error?error=access_denied`);
    }

    if (!code || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Código de autorização ou estado inválido'
      });
    }

    // Trocar código por token
    const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    });

    const {
      access_token,
      refresh_token,
      expires_at,
      athlete
    } = tokenResponse.data;

    // Salvar conta Strava
    await prisma.stravaAccount.create({
      data: {
        userId: userId as string,
        athleteId: athlete.id,
        username: athlete.username,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(expires_at * 1000)
      }
    });

    logger.info('Strava account connected successfully', { 
      userId, 
      athleteId: athlete.id 
    });

    // Redirecionar para o app com sucesso
    res.redirect(`${process.env.CORS_ORIGIN}/strava-success`);
  } catch (error) {
    logger.error('Strava callback error:', error);
    res.redirect(`${process.env.CORS_ORIGIN}/strava-error?error=connection_failed`);
  }
};

