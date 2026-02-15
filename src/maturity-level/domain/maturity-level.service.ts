import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {
    CreateMaturityCategoryDto,
    CreateMaturityQuestionDto,
    CreateMaturitySectionDto,
    CreateMaturityToolDto
} from '../dto/create-maturity-level.dto';
import {MaturityLevelRepository} from "../infrastructure/maturity-level.repository";
import {XlsxHelper} from "@/common/xlsx/xlsx.reader";
import {Sequelize} from "sequelize-typescript";
import sequelize from "sequelize";
import assert from "node:assert";
import {UpdateQuestionDto} from "@/maturity-level/dto/update-question.dto";

export type ReportItem = { title: string, total: number, resultByQuestion: number, result: number };
export type ReportType = {
    category: Array<ReportItem>,
    section: Array<ReportItem>,
    tool: Array<ReportItem>,
    total: { totalValue: number, description: string }
}

@Injectable()
export class MaturityLevelService {
    constructor(
        private readonly maturityLevelRepository: MaturityLevelRepository,
        @Inject(Sequelize) private readonly sequelize: Sequelize
    ) {
    }

    async findAll() {
        return await this.maturityLevelRepository.getTableStructure();
    }

    async getReport(dataIds: Record<string, number>): Promise<ReportType> {
        // {[questionId: number]: resultByQuestion}
        const reportByCategory = await this.getReportByCategory(dataIds);
        const reportBySection = await this.getReportBySection(dataIds);
        const reportByTool = await this.getReportByTool(dataIds);
        const totalReport = await this.getTotalReport(reportBySection);

        return {category: reportByCategory, section: reportBySection, tool: reportByTool, total: totalReport};
    }

    async getBundleParams() {
        const [questions, sections, categories, tools] = await Promise.all([
            this.maturityLevelRepository.getQuestions(),
            this.maturityLevelRepository.getSections(false),
            this.maturityLevelRepository.getCategories(false),
            this.maturityLevelRepository.getTools(false),
        ])

        return {questions, sections, categories, tools};
    }

    async updateQuestion(id: number, question: UpdateQuestionDto) {
        return await this.maturityLevelRepository.updateQuestion(id, question);
    }

    private async getReportByCategory(dataIds: Record<string, number>) {
        const result: Array<{ title: string, total: number, resultByQuestion: number, result: number }> = [];
        const categories = await this.maturityLevelRepository.getCategories();

        categories.forEach((category) => {
            let resultByQuestion = 0;

            category.questions?.forEach((question) => {
                if (dataIds[question])
                    resultByQuestion += dataIds[question];
            })

            const total = (category.questions?.length || 0) * 3;
            result.push({
                title:            category.title,
                total,
                resultByQuestion: resultByQuestion,
                result:           +(resultByQuestion / total * 100).toFixed(2),
            })
        })

        return result;
    }

    private async getReportBySection(dataIds: Record<string, number>) {
        const result: Array<{ title: string, total: number, resultByQuestion: number, result: number }> = [];
        const sections = await this.maturityLevelRepository.getSections();

        sections.forEach((section) => {
            let resultByQuestion = 0;
            section.rows?.forEach((row) => {
                if (dataIds[row])
                    resultByQuestion += dataIds[row];
            })
            const total = (section.rows?.length || 0) * 3;
            result.push({
                title:            section.title,
                total,
                resultByQuestion: resultByQuestion,
                result:           +(resultByQuestion / total * 100).toFixed(2),
            })
        })

        return result;
    }

    private async getReportByTool(dataIds: Record<string, number>) {
        const result: Array<{ title: string, total: number, resultByQuestion: number, result: number }> = [];
        const tools = await this.maturityLevelRepository.getTools();

        tools.forEach((tool) => {
            let resultByQuestion = 0;
            tool.questions?.forEach((question) => {
                if (dataIds[question])
                    resultByQuestion += dataIds[question];
            })
            const total = (tool.questions?.length || 0) * 3;
            result.push({
                title:            tool.title,
                total,
                resultByQuestion: resultByQuestion,
                result:           +(resultByQuestion / total * 100).toFixed(2),
            })
        });
        return result;
    }

    private async getTotalReport(reportBySection: Array<ReportItem>) {
        const totalResult = this.getTotalValue(reportBySection);

        return {
            totalValue:  totalResult,
            description: this.getTotalDescription(totalResult),
        };
    }

    private getTotalValue(reportBySection: Array<ReportItem>): number {
        let totalQuestions: number = 0;
        let totalResultByQuestion: number = 0;
        reportBySection.forEach((section) => {
            totalQuestions += section.total;
            totalResultByQuestion += section.resultByQuestion;
        });

        return +(totalResultByQuestion / totalQuestions * 100).toFixed(2);
    }

    private getTotalDescription(total: number) {
        if (total >= 35 && total < 50) {
            return 'Проактивный уровень';
        } else if (total >= 50 && total < 75) {
            return 'Результативная СХ-система';
        } else if (total >= 75) {
            return 'Эффективная СХ-система';
        }
        return 'Реактивный уровень системы управления клиентским опытом';
    }

    async initFromXlsx(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required. Send multipart/form-data with "file" field.');
        }

        const {sheetName, rows} = XlsxHelper.parse<any>(file.buffer, {
            sheetName: 'аудит ISO 23592',
            headerRow: 1,
        });

        if (!rows.length) {
            throw new BadRequestException(`Sheet "${sheetName}" is empty`);
        }

        const categoryDto: Record<string, CreateMaturityCategoryDto> = {};
        const toolDto: Record<string, CreateMaturityToolDto> = {};
        const sectionDto: CreateMaturitySectionDto[] = [];
        const questionDto: CreateMaturityQuestionDto[] = [];

        let categoryId = 1;
        let questionId = 1;
        let sectionId = 1;
        let toolId = 1;

        rows.forEach((row: Record<string, string>) => {
            const values = Object.values(row).slice(1, 7).filter(Boolean);
            if (values.length === 1) {
                sectionDto.push({
                    id:    sectionId,
                    title: values[0]
                });
                sectionId++;
            } else if (values.length > 1) {
                const category = row['Категория системы управления клиентским опытом'];
                if (category && !categoryDto[category]) {
                    categoryDto[category] = {id: categoryId, title: category};
                    categoryId++;
                }

                const tool = row['Рекомендуемые инструменты СХ'];
                if (tool && !toolDto[tool]) {
                    toolDto[tool] = {id: toolId, title: tool};
                    toolId++;
                }

                assert.ok(values[0] && values[1], 'Question and standard are required')

                questionDto.push({
                    id:         questionId,
                    standard:   values[0],
                    question:   values[1],
                    sectionId:  sectionDto.length,
                    categoryId: categoryDto[values[3] as keyof typeof categoryDto]?.id || null,
                    toolId:     toolDto[values[5] as keyof typeof toolDto]?.id || null,
                })
                questionId++;
            }
        });

        let transaction: sequelize.Transaction | null = null;
        try {
            transaction = await this.sequelize.transaction();
            await this.maturityLevelRepository.truncateTables(transaction);
            await this.maturityLevelRepository.createSections(sectionDto, transaction);
            await this.maturityLevelRepository.createCategories(Object.values(categoryDto), transaction);
            await this.maturityLevelRepository.createTools(Object.values(toolDto), transaction);
            await this.maturityLevelRepository.createQuestions(questionDto, transaction);
            await transaction.commit();
        } catch (error) {
            transaction && await transaction.rollback();
            throw error;
        }

        console.log(`
            Updated database with maturity levels from XLSX file. 
            Categories: ${Object.keys(categoryDto).length}; 
            Sections: ${sectionDto.length}; 
            Questions: ${questionDto.length};
        `)
    }
}
