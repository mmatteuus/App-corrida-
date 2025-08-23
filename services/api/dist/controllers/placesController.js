"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlace = exports.getPlaces = void 0;
const database_1 = __importDefault(require("../utils/database"));
const logger_1 = __importDefault(require("../utils/logger"));
const getPlaces = async (req, res) => {
    try {
        const places = await database_1.default.place.findMany({
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
    }
    catch (error) {
        logger_1.default.error('Get places error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.getPlaces = getPlaces;
const createPlace = async (req, res) => {
    try {
        const { name, type, lat, lng, address, isPublic } = req.body;
        const place = await database_1.default.place.create({
            data: {
                name,
                type,
                lat,
                lng,
                address,
                isPublic: isPublic ?? true
            }
        });
        logger_1.default.info('Place created successfully', { placeId: place.id, name: place.name });
        res.status(201).json({
            success: true,
            data: place
        });
    }
    catch (error) {
        logger_1.default.error('Create place error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
};
exports.createPlace = createPlace;
