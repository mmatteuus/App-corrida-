import { z } from 'zod';

// Enums
export const PlaceTypeSchema = z.enum(['COURT', 'FIELD', 'TRACK', 'GYM', 'OTHER']);
export type PlaceType = z.infer<typeof PlaceTypeSchema>;

export const EventStatusSchema = z.enum(['OPEN', 'FULL', 'DONE', 'CANCELLED']);
export type EventStatus = z.infer<typeof EventStatusSchema>;

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  neighborhood: z.string().optional(),
  reputation: z.number().default(0),
  createdAt: z.date(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  neighborhood: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Place schemas
export const PlaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: PlaceTypeSchema,
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export const CreatePlaceSchema = z.object({
  name: z.string().min(2),
  type: PlaceTypeSchema,
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().optional(),
  isPublic: z.boolean().default(true),
});

// Event schemas
export const EventSchema = z.object({
  id: z.string(),
  modality: z.string(),
  placeId: z.string(),
  ownerId: z.string(),
  startsAt: z.date(),
  totalSpots: z.number().positive(),
  status: EventStatusSchema.default('OPEN'),
  place: PlaceSchema.optional(),
  owner: UserSchema.optional(),
  participants: z.array(z.object({
    userId: z.string(),
    joinedAt: z.date(),
    user: UserSchema.optional(),
  })).optional(),
});

export const CreateEventSchema = z.object({
  modality: z.string().min(2),
  placeId: z.string(),
  startsAt: z.string().datetime(),
  totalSpots: z.number().positive(),
});

// Strava schemas
export const StravaAccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  athleteId: z.number(),
  username: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: UserSchema,
    token: z.string(),
    refreshToken: z.string(),
  }).optional(),
  error: z.string().optional(),
});

// Export types
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Place = z.infer<typeof PlaceSchema>;
export type CreatePlace = z.infer<typeof CreatePlaceSchema>;
export type Event = z.infer<typeof EventSchema>;
export type CreateEvent = z.infer<typeof CreateEventSchema>;
export type StravaAccount = z.infer<typeof StravaAccountSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

