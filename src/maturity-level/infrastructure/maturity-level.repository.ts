import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {CxMaturitySections} from "./models/cx_maturity_sections.models";
import {CxMaturityCategories} from "./models/cx_maturity_categories.models";
import {CxMaturityQuestions} from "./models/cx_maturity_questions.models";
import {CxMaturityTools} from "@/maturity-level/infrastructure/models/cx_maturity_tools.models";
import {
    CreateMaturityCategoryDto,
    CreateMaturityQuestionDto,
    CreateMaturitySectionDto,
    CreateMaturityToolDto
} from "../dto/create-maturity-level.dto";
import {Transaction} from "sequelize";

@Injectable()
export class MaturityLevelRepository {
    constructor(
        @InjectModel(CxMaturitySections) private readonly cxMaturitySectionsModel: typeof CxMaturitySections,
        @InjectModel(CxMaturityCategories) private readonly cxMaturityCategoriesModel: typeof CxMaturityCategories,
        @InjectModel(CxMaturityTools) private readonly cxMaturityToolsModel: typeof CxMaturityTools,
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

    async getTools(): Promise<CreateMaturityToolDto[]> {
        const res = await this.cxMaturityToolsModel.findAll({
            include: [{
                model:      CxMaturityQuestions,
                as:         'questions',
                attributes: ['id']
            }]
        });
        return res.map(tool => ({
            ...tool.dataValues,
            questions: tool.questions.map(question => question.dataValues.id)
        }) as CreateMaturityToolDto);
    }

    async truncateTables(transaction: Transaction): Promise<void> {
        await this.cxMaturitySectionsModel.truncate({cascade: true, transaction});
        await this.cxMaturityCategoriesModel.truncate({cascade: true, transaction});
        await this.cxMaturityToolsModel.truncate({cascade: true, transaction});
        await this.cxMaturityQuestionsModel.truncate({cascade: true, transaction});
    }

    async createSections(sections: CreateMaturitySectionDto[], transaction: Transaction): Promise<void> {
        await this.cxMaturitySectionsModel.bulkCreate(sections, {transaction});
    }

    async createCategories(categories: CreateMaturityCategoryDto[], transaction: Transaction): Promise<void> {
        await this.cxMaturityCategoriesModel.bulkCreate(categories, {transaction});
    }

    async createQuestions(questions: CreateMaturityQuestionDto[], transaction: Transaction): Promise<void> {
        await this.cxMaturityQuestionsModel.bulkCreate(questions, {transaction});
    }

    async createTools(tools: CreateMaturityToolDto[], transaction: Transaction): Promise<void> {
        await this.cxMaturityToolsModel.bulkCreate(tools, {transaction});
    }
}
