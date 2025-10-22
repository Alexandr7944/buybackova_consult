import {ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {hashSync} from "bcrypt-ts";
import {JwtService} from "@nestjs/jwt";
import {Response} from "express";
import {jwtConstants} from "./constants";

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
        username: string,
        pass: string
    ): Promise<{ user: { id: number, username: string }, tokens: TokenType }> {
        const password = hashSync(pass, 4);

        try {
            const candidate = await this.usersService.create({username, password});
            return await this.respondWithToken(candidate);
        } catch (error) {
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

    async respondWithToken(user: { id: number, username: string, updatedAt?: Date, refreshToken?: string }) {
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

}
