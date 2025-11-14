import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {CxMaturitySections} from "./models/cx_maturity_sections.models";
import {CxMaturityCategories} from "./models/cx_maturity_categories.models";
import {CxMaturityQuestions} from "./models/cx_maturity_questions.models";
import {CreateMaturityCategoryDto, CreateMaturityQuestionDto, CreateMaturitySectionDto} from "../dto/create-maturity-level.dto";

@Injectable()
export class MaturityLevelRepository {
    constructor(
        @InjectModel(CxMaturitySections) private readonly cxMaturitySectionsModel: typeof CxMaturitySections,
        @InjectModel(CxMaturityCategories) private readonly cxMaturityCategoriesModel: typeof CxMaturityCategories,
        @InjectModel(CxMaturityQuestions) private readonly cxMaturityQuestionsModel: typeof CxMaturityQuestions,
    ) {
    }

    async getTableStructure() {
        return await this.cxMaturitySectionsModel.findAll({
            include: [
                {
                    model:      CxMaturityQuestions,
                    as:         'rows',
                    attributes: ['id', 'standard', 'question']
                },
            ],
        });
    }

    async getCategories(): Promise<CreateMaturityCategoryDto[]> {
        const res = await this.cxMaturityCategoriesModel.findAll({
            include: [{
                model:      CxMaturityQuestions,
                as:         'questions',
                attributes: ['id']
            }]
        });
        return res.map(category => ({
            ...category.dataValues,
            questions: category.questions.map(question => question.dataValues.id)
        }) as CreateMaturityCategoryDto)
    }

    async getSections(): Promise<CreateMaturitySectionDto[]> {
        const res = await this.cxMaturitySectionsModel.findAll({
            include: [{
                model:      CxMaturityQuestions,
                as:         'rows',
                attributes: ['id']
            }]
        });
        return res.map(sections => ({
            ...sections.dataValues,
            rows: sections.rows.map(row => row.dataValues.id)
        }) as CreateMaturityCategoryDto)
    }

    async truncateTables(): Promise<void> {
        await this.cxMaturitySectionsModel.truncate({cascade: true});
        await this.cxMaturityCategoriesModel.truncate({cascade: true});
        await this.cxMaturityQuestionsModel.truncate({cascade: true});
    }

    async createSections(sections: CreateMaturitySectionDto[]): Promise<void> {
        await this.cxMaturitySectionsModel.bulkCreate(sections);
    }

    async createCategories(categories: CreateMaturityCategoryDto[]): Promise<void> {
        await this.cxMaturityCategoriesModel.bulkCreate(categories);
    }

    async createQuestions(questions: CreateMaturityQuestionDto[]): Promise<void> {
        await this.cxMaturityQuestionsModel.bulkCreate(questions);
    }
}
