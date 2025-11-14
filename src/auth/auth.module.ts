import {Module} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {APP_GUARD, Reflector} from "@nestjs/core";
import {PassportModule} from "@nestjs/passport";
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from "@/users/users.module";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtAuthGuard} from "./gards/jwt-auth.guard";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {AdminGuard} from "./gards/admin.guard";

@Module({
    imports:     [
        UsersModule,
        JwtModule.register({global: true}),
        PassportModule
    ],
    controllers: [AuthController],
    providers:   [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        Reflector,
        {provide: APP_GUARD, useClass: JwtAuthGuard},
        {provide: APP_GUARD, useClass: AdminGuard},
    ],
})
export class AuthModule {
}
