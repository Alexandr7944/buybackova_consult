import {Controller, Get, Post, UseInterceptors, UploadedFile, Patch, Param, Body} from '@nestjs/common';
import {MaturityLevelService} from './domain/maturity-level.service';
import {FileInterceptor} from "@nestjs/platform-express";
import type {Express} from 'express';
import {ForAdmin} from "@/auth/decorators/for-admin.decorator";
import {UpdateQuestionDto} from "@/maturity-level/dto/update-question.dto";

@Controller('maturity-level')
export class MaturityLevelController {
    constructor(
        private readonly maturityLevelService: MaturityLevelService
    ) {
    }

    @Get()
    async findAll() {
        return await this.maturityLevelService.findAll();
    }

    @ForAdmin()
    @Get('bundle-params')
    async getQuestions() {
        return await this.maturityLevelService.getBundleParams();
    }

    @ForAdmin()
    @Patch('question/:id')
    async updateQuestion(
        @Param('id') id: string,
        @Body() updateQuestionDto: UpdateQuestionDto
        ) {
        return await this.maturityLevelService.updateQuestion(+id, updateQuestionDto);
    }

    @Post('init')
    @UseInterceptors(FileInterceptor('file'))
    async init(@UploadedFile() file: Express.Multer.File) {
        await this.maturityLevelService.initFromXlsx(file);
        return {result: 'ok'}
    }
}
