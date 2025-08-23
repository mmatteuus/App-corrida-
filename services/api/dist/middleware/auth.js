"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const logger_1 = __importDefault(require("../utils/logger"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Token de acesso requerido'
        });
    }
    try {
        const decoded = (0, auth_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.default.error('Token verification failed:', error);
        return res.status(403).json({
            success: false,
            error: 'Token inválido ou expirado'
        });
    }
};
exports.authenticateToken = authenticateToken;
