import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Users} from "./users.model";
import {UsersRepository} from "./users.repository";

@Module({
    imports:   [
        SequelizeModule.forFeature([Users])
    ],
    providers: [UsersService, UsersRepository],
    exports:   [UsersService, UsersRepository],
})
export class UsersModule {
}
