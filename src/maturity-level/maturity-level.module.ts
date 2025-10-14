import {Module} from '@nestjs/common';
import {MaturityLevelService} from './maturity-level.service';
import {MaturityLevelController} from './maturity-level.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {CxMaturityQuestions} from "./models/cx_maturity_questions.models";
import {CxMaturitySections} from "./models/cx_maturity_sections.models";
import {MaturityLevelRepository} from "./maturity-level.repository";
import {CxMaturityCategories} from "./models/cx_maturity_categories.models";

@Module({
    imports:     [
        SequelizeModule.forFeature([CxMaturityQuestions, CxMaturitySections, CxMaturityCategories])
    ],
    controllers: [MaturityLevelController],
    providers:   [MaturityLevelService, MaturityLevelRepository],
})
export class MaturityLevelModule {
}
