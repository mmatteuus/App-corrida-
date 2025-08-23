"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseSchema = exports.ApiResponseSchema = exports.StravaAccountSchema = exports.CreateEventSchema = exports.EventSchema = exports.CreatePlaceSchema = exports.PlaceSchema = exports.LoginSchema = exports.CreateUserSchema = exports.UserSchema = exports.EventStatusSchema = exports.PlaceTypeSchema = void 0;
const zod_1 = require("zod");
// Enums
exports.PlaceTypeSchema = zod_1.z.enum(['COURT', 'FIELD', 'TRACK', 'GYM', 'OTHER']);
exports.EventStatusSchema = zod_1.z.enum(['OPEN', 'FULL', 'DONE', 'CANCELLED']);
// User schemas
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
    neighborhood: zod_1.z.string().optional(),
    reputation: zod_1.z.number().default(0),
    createdAt: zod_1.z.date(),
});
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2),
    neighborhood: zod_1.z.string().optional(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
// Place schemas
exports.PlaceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    type: exports.PlaceTypeSchema,
    lat: zod_1.z.number(),
    lng: zod_1.z.number(),
    address: zod_1.z.string().optional(),
    isPublic: zod_1.z.boolean().default(true),
});
exports.CreatePlaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    type: exports.PlaceTypeSchema,
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    address: zod_1.z.string().optional(),
    isPublic: zod_1.z.boolean().default(true),
});
// Event schemas
exports.EventSchema = zod_1.z.object({
    id: zod_1.z.string(),
    modality: zod_1.z.string(),
    placeId: zod_1.z.string(),
    ownerId: zod_1.z.string(),
    startsAt: zod_1.z.date(),
    totalSpots: zod_1.z.number().positive(),
    status: exports.EventStatusSchema.default('OPEN'),
    place: exports.PlaceSchema.optional(),
    owner: exports.UserSchema.optional(),
    participants: zod_1.z.array(zod_1.z.object({
        userId: zod_1.z.string(),
        joinedAt: zod_1.z.date(),
        user: exports.UserSchema.optional(),
    })).optional(),
});
exports.CreateEventSchema = zod_1.z.object({
    modality: zod_1.z.string().min(2),
    placeId: zod_1.z.string(),
    startsAt: zod_1.z.string().datetime(),
    totalSpots: zod_1.z.number().positive(),
});
// Strava schemas
exports.StravaAccountSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    athleteId: zod_1.z.number(),
    username: zod_1.z.string().optional(),
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    expiresAt: zod_1.z.date(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// API Response schemas
exports.ApiResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    data: zod_1.z.any().optional(),
    error: zod_1.z.string().optional(),
});
exports.AuthResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    data: zod_1.z.object({
        user: exports.UserSchema,
        token: zod_1.z.string(),
        refreshToken: zod_1.z.string(),
    }).optional(),
    error: zod_1.z.string().optional(),
});
//# sourceMappingURL=types.js.map