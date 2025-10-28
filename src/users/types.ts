import {Request} from 'express';

export interface UserAttributes {
    id: number;
    refreshToken?: string | null;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface UserRequestAttributes {
        id: number;
        username: string;
        roles: string[];
}

export interface UserRequest extends Request {
    user: {
        id: number;
        username: string;
        roles: string[];
    };
}

