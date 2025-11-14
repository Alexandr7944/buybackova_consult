import {Module} from '@nestjs/common';
import {CompaniesService} from './companies.service';
import {CompaniesController} from './companies.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Company} from "./infrastructure/models/company.model";
import {CompaniesRepository} from "./infrastructure/companies.repository";
import {UsersModule} from "@/users/users.module";
import {Users} from "@/users/infrastructure/models/users.model";
import {AuditableObject} from "@/auditable-object/infrastructure/auditable-object.model";

@Module({
    imports:     [
        UsersModule,
        SequelizeModule.forFeature([Company, Users, AuditableObject])
    ],
    controllers: [CompaniesController],
    providers:   [CompaniesService, CompaniesRepository],
})
export class CompaniesModule {
}
