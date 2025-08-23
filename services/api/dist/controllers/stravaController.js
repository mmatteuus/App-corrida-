"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stravaCallback = exports.startStravaAuth = void 0;
const database_1 = __importDefault(require("../utils/database"));
const logger_1 = __importDefault(require("../utils/logger"));
const axios_1 = __importDefault(require("axios"));
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = process.env.STRAVA_REDIRECT_URI;
const startStravaAuth = async (req, res) => {
    try {
        const userId = req.user.userId;
        // Verificar se já tem conta Strava conectada
        const existingStrava = await database_1.default.stravaAccount.findUnique({
            where: { userId }
        });
        if (existingStrava) {
            return res.status(409).json({
                success: false,
                error: 'Conta Strava já conectada'
            });
        }
        const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(STRAVA_REDIRECT_URI)}&approval_prompt=force&scope=read,activity:read_all&state=${userId}`;
        res.json({
            success: true,
            data: {
                authUrl
            }
        });
    }
    catch (error) {
        logger_1.default.error('Start Strava auth error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.startStravaAuth = startStravaAuth;
const stravaCallback = async (req, res) => {
    try {
        const { code, state: userId, error } = req.query;
        if (error) {
            logger_1.default.warn('Strava auth denied:', { error, userId });
            return res.redirect(`${process.env.CORS_ORIGIN}/strava-error?error=access_denied`);
        }
        if (!code || !userId) {
            return res.status(400).json({
                success: false,
                error: 'Código de autorização ou estado inválido'
            });
        }
        // Trocar código por token
        const tokenResponse = await axios_1.default.post('https://www.strava.com/oauth/token', {
            client_id: STRAVA_CLIENT_ID,
            client_secret: STRAVA_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code'
        });
        const { access_token, refresh_token, expires_at, athlete } = tokenResponse.data;
        // Salvar conta Strava
        await database_1.default.stravaAccount.create({
            data: {
                userId: userId,
                athleteId: athlete.id,
                username: athlete.username,
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: new Date(expires_at * 1000)
            }
        });
        logger_1.default.info('Strava account connected successfully', {
            userId,
            athleteId: athlete.id
        });
        // Redirecionar para o app com sucesso
        res.redirect(`${process.env.CORS_ORIGIN}/strava-success`);
    }
    catch (error) {
        logger_1.default.error('Strava callback error:', error);
        res.redirect(`${process.env.CORS_ORIGIN}/strava-error?error=connection_failed`);
    }
};
exports.stravaCallback = stravaCallback;
