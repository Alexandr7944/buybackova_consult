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
import {UpdateQuestionDto} from "@/maturity-level/dto/update-question.dto";

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

    async getCategories(isWithIncludes: boolean = true): Promise<CreateMaturityCategoryDto[]> {
        const include = isWithIncludes ? [{
            model:      CxMaturityQuestions,
            as:         'questions',
            attributes: ['id']
        }] : [];

        const res = await this.cxMaturityCategoriesModel.findAll({include});
        return res.map(category => ({
            ...category.dataValues,
            questions: category.questions?.map(question => question.dataValues.id)
        }) as CreateMaturityCategoryDto)
    }

    async getSections(isWithIncludes: boolean = true): Promise<CreateMaturitySectionDto[]> {
        const include = isWithIncludes ? [{
            model:      CxMaturityQuestions,
            as:         'rows',
            attributes: ['id'],
        }] : [];

        const res = await this.cxMaturitySectionsModel.findAll({include});
        return res.map(sections => ({
            ...sections.dataValues,
            rows: sections.rows?.map(row => row.dataValues.id)
        }) as CreateMaturityCategoryDto)
    }

    async getTools(isWithIncludes: boolean = true): Promise<CreateMaturityToolDto[]> {
        const include = isWithIncludes ? [{
            model:      CxMaturityQuestions,
            as:         'questions',
            attributes: ['id']
        }] : [];

        const res = await this.cxMaturityToolsModel.findAll({include});
        return res.map(tool => ({
            ...tool.dataValues,
            questions: tool.questions?.map(question => question.dataValues.id)
        }) as CreateMaturityToolDto);
    }

    async getQuestions() {
        return await this.cxMaturityQuestionsModel.findAll({
            order: [['id', 'ASC']]
        });
    }

    async updateQuestion(id: number, question: UpdateQuestionDto) {
        const [count] = await this.cxMaturityQuestionsModel.update({
            standard: question.standard
        }, {
            where: {id}
        })
        return Boolean(count);
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
