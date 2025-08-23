"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinEvent = exports.createEvent = exports.getEventById = exports.getEvents = void 0;
const database_1 = __importDefault(require("../utils/database"));
const logger_1 = __importDefault(require("../utils/logger"));
const getEvents = async (req, res) => {
    try {
        const events = await database_1.default.event.findMany({
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
    }
    catch (error) {
        logger_1.default.error('Get events error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await database_1.default.event.findUnique({
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
    }
    catch (error) {
        logger_1.default.error('Get event by id error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.getEventById = getEventById;
const createEvent = async (req, res) => {
    try {
        const { modality, placeId, startsAt, totalSpots } = req.body;
        const userId = req.user.userId;
        // Verificar se o local existe
        const place = await database_1.default.place.findUnique({
            where: { id: placeId }
        });
        if (!place) {
            return res.status(404).json({
                success: false,
                error: 'Local não encontrado'
            });
        }
        const event = await database_1.default.event.create({
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
        logger_1.default.info('Event created successfully', { eventId: event.id, modality: event.modality });
        res.status(201).json({
            success: true,
            data: event
        });
    }
    catch (error) {
        logger_1.default.error('Create event error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.createEvent = createEvent;
const joinEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        // Verificar se o evento existe
        const event = await database_1.default.event.findUnique({
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
            await database_1.default.event.update({
                where: { id },
                data: { status: 'FULL' }
            });
            return res.status(400).json({
                success: false,
                error: 'Evento lotado'
            });
        }
        // Adicionar participante
        await database_1.default.eventParticipant.create({
            data: {
                eventId: id,
                userId
            }
        });
        // Verificar se o evento ficou lotado
        const updatedParticipantsCount = event.participants.length + 1;
        if (updatedParticipantsCount >= event.totalSpots) {
            await database_1.default.event.update({
                where: { id },
                data: { status: 'FULL' }
            });
        }
        logger_1.default.info('User joined event successfully', { eventId: id, userId });
        res.json({
            success: true,
            data: {
                message: 'Participação confirmada com sucesso'
            }
        });
    }
    catch (error) {
        logger_1.default.error('Join event error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.joinEvent = joinEvent;
