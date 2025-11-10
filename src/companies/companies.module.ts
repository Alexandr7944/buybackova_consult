import {Module} from '@nestjs/common';
import {CompaniesService} from './companies.service';
import {CompaniesController} from './companies.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Company} from "./infrastructure/models/company.model";
import {CompaniesRepository} from "./infrastructure/companies.repository";
import {UsersModule} from "../users/users.module";

@Module({
    imports:     [
        UsersModule,
        SequelizeModule.forFeature([Company])
    ],
    controllers: [CompaniesController],
    providers:   [CompaniesService, CompaniesRepository],
})
export class CompaniesModule {
}
