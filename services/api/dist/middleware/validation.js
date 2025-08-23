"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateBody = void 0;
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                logger_1.default.warn('Validation error:', { errors, body: req.body });
                return res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    details: errors
                });
            }
            logger_1.default.error('Unexpected validation error:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    };
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            req.query = schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetros de consulta inválidos',
                    details: errors
                });
            }
            return res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    };
};
exports.validateQuery = validateQuery;
