import {
    Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {Public} from "./SkipAuth";
import {LoginDto} from "./dto/login.dto";
import type {Response} from 'express';
import {LocalAuthGuard} from "./gards/local-auth.guard";
import {UserRequest} from "../users/types";

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
        const {user, tokens} = await this.authService.registration(signInDto);
        this.authService.setCookie(res, tokens.refreshToken);
        const userDto = {id: user.id, username: user.username}
        return {user: userDto, token: tokens.accessToken};
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Req() req: UserRequest,
        @Res({passthrough: true}) res: Response,
    ) {
        const {tokens} = await this.authService.respondWithToken(req.user);
        this.authService.setCookie(res, tokens.refreshToken);
        return {user: req.user, token: tokens.accessToken};
    }

    @Public()
    @Get('refresh')
    async refreshToken(
        @Req() req: UserRequest,
        @Res({passthrough: true}) res: Response
    ) {
        const {refreshToken} = req.cookies;
        const {user, tokens} = await this.authService.refreshToken(refreshToken);

        this.authService.setCookie(res, tokens.refreshToken);
        const userDto = {id: user.id, username: user.username}
        return {user: userDto, token: tokens.accessToken};
    }

    @Get('profile')
    async getProfile(@Req() req: UserRequest) {
        return this.authService.getAuthenticatedUser(req.user)
    }

    @Get ('logout')
    async logout(@Res({passthrough: true}) res: Response) {
        res.clearCookie('refreshToken');
        return {message: 'Logged out successfully'};
    }
}
