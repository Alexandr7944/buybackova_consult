import {Request} from 'express';

export interface UserAttributes {
    id: number;
    refreshToken?: string | null;
    companyId?: number;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface UserRequestAttributes {
    id: number;
    username: string;
    roles: string[];
    isAdmin: boolean;
    companyId?: number | null,
}

export interface UserRequest extends Request {
    user: UserRequestAttributes;
}

