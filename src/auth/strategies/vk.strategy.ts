// import { Injectable, Inject } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-vk-id';
// // import { ConfigService } from '@nestjs/config';
// // import { AuthService} from '../servcies/AuthService';
// import {Profile} from "passport";
//
// @Injectable()
// export class VkStrategy extends PassportStrategy(Strategy, 'vk-id') {
//     private authService: AuthService; // Объявляем свойство с сервисом
//
//     constructor(
//         private readonly configService: ConfigService,
//         // @Inject(AuthService) authService: AuthService, // инжектим сервис
//     ) {
//         super({
//                 clientID: configService.get<string>('VK_CLIENT_ID'),
//                 clientSecret: configService.get<string>('VK_CLIENT_SECRET'),
//                 callbackURL: configService.get<string>('SERVER_HOST') + '/api/auth/vk/callback',
//                 scope: ['email'],
//                 provider: "vkid",
//                 profileFields: ['id', 'displayName'],
//             });
//
//         // // Явно задаём функцию обработчик
//         // async (
//         //     accessToken: string, refreshToken: string, params: Params,
//         //     profile: Profile, done: VerifyCallback) => {
//         //     return this.validate(
//         //         accessToken, refreshToken, params, profile, done);
//         // }
//         // this.authService = authService; // Передаём сервис в свойство
//     }
//
//     async validate(
//         accessToken: string,
//         refreshToken: string,
//         params: Params,
//         profile: Profile,
//         done: VerifyCallback,
//     ) {
//         const { id, displayName } = profile;
//
//         // Используем подключённый сервис
//         const user = await this.authService.validateOauthUser(displayName, id);
//         return done(null, user);
//     }
// }
