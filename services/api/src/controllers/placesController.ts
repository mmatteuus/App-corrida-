import { Request, Response } from 'express';
import { CreatePlaceSchema } from '@conexao-ativa/shared';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../utils/database';
import logger from '../utils/logger';

export const getPlaces = async (req: Request, res: Response) => {
  try {
    const places = await prisma.place.findMany({
      where: {
        isPublic: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      data: places
    });
  } catch (error) {
    logger.error('Get places error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const createPlace = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, type, lat, lng, address, isPublic } = req.body;

    const place = await prisma.place.create({
      data: {
        name,
        type,
        lat,
        lng,
        address,
        isPublic: isPublic ?? true
      }
    });

    logger.info('Place created successfully', { placeId: place.id, name: place.name });

    res.status(201).json({
      success: true,
      data: place
    });
  } catch (error) {
    logger.error('Create place error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

