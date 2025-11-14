import {Module} from '@nestjs/common';
import {AuditableObjectService} from './domain/auditable-object.service';
import {AuditableObjectController} from './auditable-object.controller';
import {AuditableObject} from "./infrastructure/auditable-object.model";
import {SequelizeModule} from "@nestjs/sequelize";
import {AuditableObjectRepository} from "./infrastructure/auditable-object.repository";
import {Audit} from "@/audits/infrastructure/models/audit.model";

@Module({
    imports:     [
        SequelizeModule.forFeature([AuditableObject]),
        SequelizeModule.forFeature([Audit]),
    ],
    controllers: [AuditableObjectController],
    providers:   [AuditableObjectService, AuditableObjectRepository],
    exports:     [AuditableObjectService, AuditableObjectRepository]
})
export class AuditableObjectModule {
}
