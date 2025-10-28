import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {HttpException, Injectable} from '@nestjs/common';
import {jwtConstants} from '../constants';
import {UsersService} from "../../users/domain/users.service";
import {UserRequestAttributes} from "../../users/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest:   ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:      jwtConstants.JWT_ACCESS_SECRET,
        });
    }

    async validate(payload: {sub: number, username: string}): Promise<UserRequestAttributes> {
        const user = await this.usersService.findOne(payload.sub);
        if (!user)
            throw new HttpException('User not found', 404);

        return {
            id:       payload.sub,
            username: payload.username,
            roles:    (user?.roles ?? []).map(role => role.slug),
        }
    }
}
