import {
    Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {Public} from "./SkipAuth";
import {LoginDto} from "./dto/login.dto";
import type {Response, Request} from 'express';
import {LocalAuthGuard} from "./gards/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('registration')
    async registration(
        @Body() signInDto: LoginDto,
        @Res({passthrough: true}) res: Response,
    ) {
        const {user, tokens} = await this.authService.registration(signInDto.username, signInDto.password);
        this.authService.setCookie(res, tokens.refreshToken);
        const userDto = {id: user.id, username: user.username}
        return {user: userDto, token: tokens.accessToken};
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Req() req: Request & { user: any },
        @Res({passthrough: true}) res: Response,
    ) {
        const {user, tokens} = await this.authService.respondWithToken(req.user);
        this.authService.setCookie(res, tokens.refreshToken);
        const userDto = {id: user.id, username: user.username}
        return {user: userDto, token: tokens.accessToken};
    }

    @Public()
    @Get('refresh')
    async refreshToken(
        @Req() req: Request & { user: any },
        @Res({passthrough: true}) res: Response
    ) {
        const {refreshToken} = req.cookies;
        const {user, tokens} = await this.authService.refreshToken(refreshToken);

        this.authService.setCookie(res, tokens.refreshToken);
        const userDto = {id: user.id, username: user.username}
        return {user: userDto, token: tokens.accessToken};
    }

    @Get('profile')
    async getProfile(@Req() req: Request & { user: any }) {
        return this.authService.getAuthenticatedUser(req.user)
    }
}
