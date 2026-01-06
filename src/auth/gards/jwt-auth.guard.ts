import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorators/skip-auth.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err: Error, user: any, info: any) {
        if (info?.name === 'TokenExpiredError' && info?.message === 'jwt expired') {
            throw new UnauthorizedException({message: 'Token expired'});
        }
        if (err || !user) {
            throw err || new UnauthorizedException('Invalid token or user');
        }
        return user;
    }

}
