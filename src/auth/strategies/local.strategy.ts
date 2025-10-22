import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import {compareSync} from "bcrypt-ts";
import {UsersService} from "../../users/domain/users.service";
import {UserAttributes} from "../../users/infrastructure/models/users.model";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super();
    }

    async validate(username: string, pass: string): Promise<UserAttributes> {
        const profile = await this.usersService.findLocalProfile(username);
        if (!profile?.passwordHash || !compareSync(pass, profile?.passwordHash))
            throw new UnauthorizedException();

        const user = await this.usersService.findOne(profile.userId)
        if (!user)
            throw new HttpException('User not found', 404);

        return user;
    }
}
