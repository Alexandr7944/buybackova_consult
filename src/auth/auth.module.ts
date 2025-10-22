import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {APP_GUARD} from "@nestjs/core";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtAuthGuard} from "./gards/jwt-auth.guard";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
    imports:     [
        UsersModule,
        JwtModule.register({global: true}),
        PassportModule
    ],
    controllers: [AuthController],
    providers:   [
        AuthService,
        {provide: APP_GUARD, useClass: JwtAuthGuard,},
        LocalStrategy,
        JwtStrategy,
    ],
})
export class AuthModule {
}
