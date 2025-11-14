import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ADMIN_KEY} from '../decorators/for-admin.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        // 1. Проверяем, требует ли эндпоинт прав администратора
        const isAdminRequired = this.reflector.getAllAndOverride<boolean>(ADMIN_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 2. Если метки @ForAdmin() нет, разрешаем доступ.
        //    Проверку JWT уже сделает глобальный JwtAuthGuard.
        if (!isAdminRequired) {
            return true;
        }

        // 3. Если метка есть, проверяем роль пользователя.
        const {user} = context.switchToHttp().getRequest();

        // Если пользователя нет (хотя JwtAuthGuard должен был его добавить) или у него нет роли
        return user.isAdmin;
    }
}
