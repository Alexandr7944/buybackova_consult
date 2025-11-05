import {Module} from '@nestjs/common';
import {UsersService} from './domain/users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Users} from "./infrastructure/models/users.model";
import {UsersRepository} from "./infrastructure/users.repository";
import {Role} from "./infrastructure/models/roles.model";
import {UserRole} from "./infrastructure/models/user-roles.model";
import {Profile} from "./infrastructure/models/profile.model";
import { UsersController } from './users.controller';

@Module({
    imports:   [
        SequelizeModule.forFeature([Users, Role, UserRole, Profile])
    ],
    providers: [UsersService, UsersRepository],
    exports:   [UsersService, UsersRepository],
    controllers: [UsersController],
})
export class UsersModule {
}
