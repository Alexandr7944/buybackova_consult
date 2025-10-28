import {Module} from '@nestjs/common';
import {AuditsService} from './domain/audits.service';
import {AuditsController} from './audits.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {AuditResults} from "./infrastructure/models/audit-results.model";
import {Audit} from "./infrastructure/models/audit.model";
import {AuditsRepository} from "./infrastructure/audits.repository";
import {MaturityLevelModule} from "../maturity-level/maturity-level.module";
import {AuditableObject} from "../auditable-object/infrastructure/auditable-object.model";

@Module({
    imports:     [SequelizeModule.forFeature([Audit, AuditResults, AuditableObject]), MaturityLevelModule],
    controllers: [AuditsController],
    providers:   [AuditsService, AuditsRepository],
})
export class AuditsModule {
}
