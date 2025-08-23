import { z } from 'zod';
export declare const PlaceTypeSchema: z.ZodEnum<["COURT", "FIELD", "TRACK", "GYM", "OTHER"]>;
export type PlaceType = z.infer<typeof PlaceTypeSchema>;
export declare const EventStatusSchema: z.ZodEnum<["OPEN", "FULL", "DONE", "CANCELLED"]>;
export type EventStatus = z.infer<typeof EventStatusSchema>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    neighborhood: z.ZodOptional<z.ZodString>;
    reputation: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name: string;
    reputation: number;
    createdAt: Date;
    neighborhood?: string | undefined;
}, {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    neighborhood?: string | undefined;
    reputation?: number | undefined;
}>;
export declare const CreateUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    neighborhood: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    password: string;
    neighborhood?: string | undefined;
}, {
    email: string;
    name: string;
    password: string;
    neighborhood?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const PlaceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["COURT", "FIELD", "TRACK", "GYM", "OTHER"]>;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    address: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "COURT" | "FIELD" | "TRACK" | "GYM" | "OTHER";
    id: string;
    name: string;
    lat: number;
    lng: number;
    isPublic: boolean;
    address?: string | undefined;
}, {
    type: "COURT" | "FIELD" | "TRACK" | "GYM" | "OTHER";
    id: string;
    name: string;
    lat: number;
    lng: number;
    address?: string | undefined;
    isPublic?: boolean | undefined;
}>;
export declare const CreatePlaceSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["COURT", "FIELD", "TRACK", "GYM", "OTHER"]>;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    address: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "COURT" | "FIELD" | "TRACK" | "GYM" | "OTHER";
    name: string;
    lat: number;
    lng: number;
    isPublic: boolean;
    address?: string | undefined;
}, {
    type: "COURT" | "FIELD" | "TRACK" | "GYM" | "OTHER";
    name: string;
    lat: number;
    lng: number;
    address?: string | undefined;
    isPublic?: boolean | undefined;
}>;
export declare const EventSchema: z.ZodObject<{
    id: z.ZodString;
    modality: z.ZodString;
    placeId: z.ZodString;
    ownerId: z.ZodString;
    startsAt: z.ZodDate;
    totalSpots: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<["OPEN", "FULL", "DONE", "CANCELLED"]>>;
    place: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<["COURT", "FIELD", "TRACK", "GYM", "OTHER"]>;
        lat: z.ZodNumber;
        lng: z.ZodNumber;
        address: z.ZodOptional<z.ZodString>;
        isPublic: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "COURT" | "FIELD" | "TRACK" | "GYM" | "OTHER";
        id: string;
        name: string;
        lat: number;
        lng: number;
        isPublic: boolean;
        address?: string | undefined;
    }, {
        type: "COURT" | "FIELD" | "TRACK" | "GYM" | "OTHER";
        id: string;
        name: string;
        lat: number;
        lng: number;
        address?: string | undefined;
        isPublic?: boolean | undefined;
    }>>;
    owner: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        neighborhood: z.ZodOptional<z.ZodString>;
        reputation: z.ZodDefault<z.ZodNumber>;
        createdAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string;
        name: string;
        reputation: number;
        createdAt: Date;
        neighborhood?: string | undefined;
    }, {
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        neighborhood?: string | undefined;
        reputation?: number | undefined;
    }>>;
    participants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        joinedAt: z.ZodDate;
        user: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            name: z.ZodString;
            neighborhood: z.ZodOptional<z.ZodString>;
            reputation: z.ZodDefault<z.ZodNumber>;
            createdAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            id: string;
            email: string;
            name: string;
            reputation: number;
            createdAt: Date;
            neighborhood?: string | undefined;
        }, {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            neighborhood?: string | undefined;
            reputation?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        joinedAt: Date;
        user?: {
            id: string;
            email: string;
            name: string;
            reputation: number;
            createdAt: Date;
            neighborhood?: string | undefined;
        } | undefined;
    }, {
        userId: string;
        joinedAt: Date;
        user?: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            neighborhood?: string | undefined;
            reputation?: number | undefined;
        } | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "OPEN" | "FULL" | "DONE" | "CANCELLED";
    id: string;
    modality: string;
    placeId: string;
    ownerId: string;
    startsAt: Date;
    totalSpots: number;
    place?: {
        type: "COURT" | "FIELD" | "TRACK" | "GYM" | "OTHER";
        id: string;
        name: string;
        lat: number;
        lng: number;
        isPublic: boolean;
        address?: string | undefined;
    } | undefined;
    owner?: {
        id: string;
        email: string;
        name: string;
        reputation: number;
        createdAt: Date;
        neighborhood?: string | undefined;
    } | undefined;
    participants?: {
        userId: string;
        joinedAt: Date;
        user?: {
            id: string;
            email: string;
            name: string;
            reputation: number;
            createdAt: Date;
            neighborhood?: string | undefined;
        } | undefined;
    }[] | undefined;
}, {
    id: string;
    modality: string;
    placeId: string;
    ownerId: string;
    startsAt: Date;
    totalSpots: number;
    status?: "OPEN" | "FULL" | "DONE" | "CANCELLED" | undefined;
    place?: {
        type: "COURT" | "FIELD" | "TRACK" | "GYM" | "OTHER";
        id: string;
        name: string;
        lat: number;
        lng: number;
        address?: string | undefined;
        isPublic?: boolean | undefined;
    } | undefined;
    owner?: {
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        neighborhood?: string | undefined;
        reputation?: number | undefined;
    } | undefined;
    participants?: {
        userId: string;
        joinedAt: Date;
        user?: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            neighborhood?: string | undefined;
            reputation?: number | undefined;
        } | undefined;
    }[] | undefined;
}>;
export declare const CreateEventSchema: z.ZodObject<{
    modality: z.ZodString;
    placeId: z.ZodString;
    startsAt: z.ZodString;
    totalSpots: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    modality: string;
    placeId: string;
    startsAt: string;
    totalSpots: number;
}, {
    modality: string;
    placeId: string;
    startsAt: string;
    totalSpots: number;
}>;
export declare const StravaAccountSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    athleteId: z.ZodNumber;
    username: z.ZodOptional<z.ZodString>;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    expiresAt: z.ZodDate;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    userId: string;
    athleteId: number;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    updatedAt: Date;
    username?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    userId: string;
    athleteId: number;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    updatedAt: Date;
    username?: string | undefined;
}>;
export declare const ApiResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    data?: any;
    error?: string | undefined;
}, {
    success: boolean;
    data?: any;
    error?: string | undefined;
}>;
export declare const AuthResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        user: z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            name: z.ZodString;
            neighborhood: z.ZodOptional<z.ZodString>;
            reputation: z.ZodDefault<z.ZodNumber>;
            createdAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            id: string;
            email: string;
            name: string;
            reputation: number;
            createdAt: Date;
            neighborhood?: string | undefined;
        }, {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            neighborhood?: string | undefined;
            reputation?: number | undefined;
        }>;
        token: z.ZodString;
        refreshToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        user: {
            id: string;
            email: string;
            name: string;
            reputation: number;
            createdAt: Date;
            neighborhood?: string | undefined;
        };
        refreshToken: string;
        token: string;
    }, {
        user: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            neighborhood?: string | undefined;
            reputation?: number | undefined;
        };
        refreshToken: string;
        token: string;
    }>>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    data?: {
        user: {
            id: string;
            email: string;
            name: string;
            reputation: number;
            createdAt: Date;
            neighborhood?: string | undefined;
        };
        refreshToken: string;
        token: string;
    } | undefined;
    error?: string | undefined;
}, {
    success: boolean;
    data?: {
        user: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            neighborhood?: string | undefined;
            reputation?: number | undefined;
        };
        refreshToken: string;
        token: string;
    } | undefined;
    error?: string | undefined;
}>;
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
//# sourceMappingURL=types.d.ts.map