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

@Injectable()
export class InitialFillingDatabaseService {
    constructor(
        private readonly maturityLevelRepository: MaturityLevelRepository,
        @Inject(Sequelize) private readonly sequelize: Sequelize
    ) {
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
