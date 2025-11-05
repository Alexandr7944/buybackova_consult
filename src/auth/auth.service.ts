import {ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/domain/users.service";
import {hashSync} from "bcrypt-ts";
import {JwtService} from "@nestjs/jwt";
import {Response} from "express";
import {jwtConstants} from "./constants";
import {Role} from "../users/infrastructure/models/roles.model";
import {AuthProvider, Profile} from "../users/infrastructure/models/profile.model";
import {LoginDto} from "./dto/login.dto";
import {UserRequestAttributes} from "../users/types";

type TokenType = {
    accessToken: string,
    refreshToken: string
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
    }

    async registration(
        {name, username, password: pass}: LoginDto
    ): Promise<{
        user: { id: number, username: string },
        tokens: TokenType
    }> {
        const password = hashSync(pass, 4);

        try {
            const candidate = await this.usersService.create({name, username, password});
            return await this.respondWithToken(candidate);
        } catch (error) {
            console.error(error)
            throw new UnauthorizedException(error.message);
        }
    }

    async refreshToken(refreshToken: string): Promise<{ user: { id: number, username: string }, tokens: TokenType }> {
        let payload: any;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: jwtConstants.JWT_REFRESH_SECRET,
            });
        } catch {
            throw new ForbiddenException('Invalid refresh token');
        }

        return await this.respondWithToken({id: payload.sub, username: payload.username});
    }

    async respondWithToken(user: { id: number, username: string }) {
        const payload = {sub: user.id, username: user.username};
        const tokens = await this.generateToken(payload);

        const updatedValue = await this.usersService.update(user.id, {refreshToken: tokens.refreshToken});
        if (!updatedValue)
            throw new ForbiddenException('Unable to update refresh token');

        return {user, tokens};
    }

    setCookie(res: Response, token: string) {
        const isProd = process.env.NODE_ENV === 'production';
        const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
        const maxAgeMs = 15 * 24 * 60 * 60 * 1000; // 15 days

        res.cookie('refreshToken', token, {
            httpOnly: true,
            sameSite: (isProd ? 'none' : 'lax') as 'lax' | 'none',
            secure:   isProd,
            domain:   cookieDomain,
            maxAge:   maxAgeMs,
        });
    }

    private async generateToken(payload: { sub: number, username: string }) {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret:    jwtConstants.JWT_ACCESS_SECRET,
            expiresIn: '15m'
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret:    jwtConstants.JWT_REFRESH_SECRET,
            expiresIn: '15d'
        });

        return {accessToken, refreshToken}
    }

    async getAuthenticatedUser({id, username}: UserRequestAttributes): Promise<{
        name: string,
        username: string,
        roles: Array<string>,
        profiles: Array<{
            provider: AuthProvider,
            providerUserId: string,
            displayName: string,
        }>,
    }> {
        const user = await this.usersService.findOne(id);
        if (!user || !user.roles || !user.profiles)
            throw new ForbiddenException('User not found');

        return {
            name:     user.name,
            username,
            roles:    user.roles.map((role: Role) => role.slug),
            profiles: user.profiles.map((profile: Profile) => ({
                provider:       profile.provider,
                providerUserId: profile.providerUserId,
                displayName:    profile.displayName ?? '',
            })),
        };
    }

}
