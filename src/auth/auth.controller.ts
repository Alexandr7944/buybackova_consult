import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post, Req,
    Res,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {Public} from "./SkipAuth";
import {LoginDto} from "./dto/login.dto";
import type {Response, Request} from 'express';

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
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body() signInDto: LoginDto,
        @Res({passthrough: true}) res: Response,
    ) {
        const {user, tokens} = await this.authService.signIn(signInDto.username, signInDto.password);

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
    getProfile(@Req() req: Request & { user: any }) {
        return req.user;
    }
}
