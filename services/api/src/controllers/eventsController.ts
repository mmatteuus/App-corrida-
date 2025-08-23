import { Request, Response } from 'express';
import { CreateEventSchema } from '@conexao-ativa/shared';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../utils/database';
import logger from '../utils/logger';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        place: true,
        owner: {
          select: {
            id: true,
            name: true,
            reputation: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                reputation: true
              }
            }
          }
        }
      },
      orderBy: {
        startsAt: 'asc'
      }
    });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    logger.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        place: true,
        owner: {
          select: {
            id: true,
            name: true,
            reputation: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                reputation: true
              }
            }
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Evento não encontrado'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Get event by id error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { modality, placeId, startsAt, totalSpots } = req.body;
    const userId = req.user!.userId;

    // Verificar se o local existe
    const place = await prisma.place.findUnique({
      where: { id: placeId }
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        error: 'Local não encontrado'
      });
    }

    const event = await prisma.event.create({
      data: {
        modality,
        placeId,
        ownerId: userId,
        startsAt: new Date(startsAt),
        totalSpots
      },
      include: {
        place: true,
        owner: {
          select: {
            id: true,
            name: true,
            reputation: true
          }
        }
      }
    });

    logger.info('Event created successfully', { eventId: event.id, modality: event.modality });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const joinEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Verificar se o evento existe
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        participants: true
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Evento não encontrado'
      });
    }

    // Verificar se o evento está aberto
    if (event.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        error: 'Evento não está aberto para participação'
      });
    }

    // Verificar se já está participando
    const existingParticipant = event.participants.find(p => p.userId === userId);
    if (existingParticipant) {
      return res.status(409).json({
        success: false,
        error: 'Você já está participando deste evento'
      });
    }

    // Verificar se há vagas
    if (event.participants.length >= event.totalSpots) {
      // Atualizar status para FULL
      await prisma.event.update({
        where: { id },
        data: { status: 'FULL' }
      });

      return res.status(400).json({
        success: false,
        error: 'Evento lotado'
      });
    }

    // Adicionar participante
    await prisma.eventParticipant.create({
      data: {
        eventId: id,
        userId
      }
    });

    // Verificar se o evento ficou lotado
    const updatedParticipantsCount = event.participants.length + 1;
    if (updatedParticipantsCount >= event.totalSpots) {
      await prisma.event.update({
        where: { id },
        data: { status: 'FULL' }
      });
    }

    logger.info('User joined event successfully', { eventId: id, userId });

    res.json({
      success: true,
      data: {
        message: 'Participação confirmada com sucesso'
      }
    });
  } catch (error) {
    logger.error('Join event error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

