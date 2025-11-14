import {Controller, Get, Post, UseInterceptors, UploadedFile} from '@nestjs/common';
import {MaturityLevelService} from './domain/maturity-level.service';
import {FileInterceptor} from "@nestjs/platform-express";
import type {Express} from 'express';

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

    @Post('init')
    @UseInterceptors(FileInterceptor('file'))
    async init(@UploadedFile() file: Express.Multer.File) {
        await this.maturityLevelService.initFromXlsx(file);
        return {result: 'ok'}
    }
}
