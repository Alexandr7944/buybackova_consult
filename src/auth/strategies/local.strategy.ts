import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {compareSync} from "bcrypt-ts";
import {UsersService} from "../../users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super();
    }

    async validate(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && compareSync(pass, user.password)) {
            const {password, ...result} = user;
            return result;
        }
        throw new UnauthorizedException();
    }
}
