"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
// Importar rotas
const auth_1 = __importDefault(require("./routes/auth"));
const places_1 = __importDefault(require("./routes/places"));
const events_1 = __importDefault(require("./routes/events"));
const user_1 = __importDefault(require("./routes/user"));
const strava_1 = __importDefault(require("./routes/strava"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000');
// Middleware de segurança
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP por janela
    message: {
        success: false,
        error: 'Muitas tentativas. Tente novamente em 15 minutos.'
    }
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 tentativas de login por IP por janela
    message: {
        success: false,
        error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    }
});
app.use(limiter);
app.use('/auth', authLimiter);
// Middleware de parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware de logging
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});
// Rotas
app.use('/auth', auth_1.default);
app.use('/places', places_1.default);
app.use('/events', events_1.default);
app.use('/me', user_1.default);
app.use('/oauth/strava', strava_1.default);
// Rota de health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }
    });
});
// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    logger_1.default.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
    });
});
// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada'
    });
});
// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    logger_1.default.info(`Servidor rodando na porta ${PORT}`);
});
exports.default = app;
