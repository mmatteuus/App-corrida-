"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const database_1 = __importDefault(require("../utils/database"));
const logger_1 = __importDefault(require("../utils/logger"));
const getMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                neighborhood: true,
                reputation: true,
                createdAt: true,
                strava: {
                    select: {
                        id: true,
                        athleteId: true,
                        username: true,
                        createdAt: true
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        logger_1.default.error('Get me error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.getMe = getMe;
