"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const auth_1 = require("../utils/auth");
const database_1 = __importDefault(require("../utils/database"));
const logger_1 = __importDefault(require("../utils/logger"));
const signup = async (req, res) => {
    try {
        const { email, password, name, neighborhood } = req.body;
        // Verificar se o usuário já existe
        const existingUser = await database_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'Usuário já existe com este email'
            });
        }
        // Hash da senha
        const passwordHash = await (0, auth_1.hashPassword)(password);
        // Criar usuário
        const user = await database_1.default.user.create({
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
        const { accessToken, refreshToken } = (0, auth_1.generateTokens)({
            userId: user.id,
            email: user.email
        });
        logger_1.default.info('User created successfully', { userId: user.id, email: user.email });
        res.status(201).json({
            success: true,
            data: {
                user,
                token: accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        logger_1.default.error('Signup error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Buscar usuário
        const user = await database_1.default.user.findUnique({
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
        const isValidPassword = await (0, auth_1.comparePassword)(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Credenciais inválidas'
            });
        }
        // Gerar tokens
        const { accessToken, refreshToken } = (0, auth_1.generateTokens)({
            userId: user.id,
            email: user.email
        });
        // Remover hash da senha da resposta
        const { passwordHash, ...userWithoutPassword } = user;
        logger_1.default.info('User logged in successfully', { userId: user.id, email: user.email });
        res.json({
            success: true,
            data: {
                user: userWithoutPassword,
                token: accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        logger_1.default.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.login = login;
