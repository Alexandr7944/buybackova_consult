import {Module} from '@nestjs/common';
import {MaturityLevelService} from './domain/maturity-level.service';
import {MaturityLevelController} from './maturity-level.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {CxMaturityQuestions} from "./infrastructure/models/cx_maturity_questions.models";
import {CxMaturitySections} from "./infrastructure/models/cx_maturity_sections.models";
import {MaturityLevelRepository} from "./infrastructure/maturity-level.repository";
import {CxMaturityCategories} from "./infrastructure/models/cx_maturity_categories.models";
import {CxMaturityTools} from "@/maturity-level/infrastructure/models/cx_maturity_tools.models";

@Module({
    imports:     [
        SequelizeModule.forFeature([CxMaturityQuestions, CxMaturitySections, CxMaturityCategories, CxMaturityTools])
    ],
    controllers: [MaturityLevelController],
    providers:   [MaturityLevelService, MaturityLevelRepository],
    exports:     [MaturityLevelService]
})
export class MaturityLevelModule {
}
