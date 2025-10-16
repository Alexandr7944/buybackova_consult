import {Controller, Get, Post, UseInterceptors, UploadedFile, Body, HttpException, HttpStatus} from '@nestjs/common';
import {MaturityLevelService} from './maturity-level.service';
import {FileInterceptor} from "@nestjs/platform-express";
import type {Express} from 'express';
import {Public} from "../auth/SkipAuth";

@Controller('maturity-level')
export class MaturityLevelController {
    constructor(
        private readonly maturityLevelService: MaturityLevelService
    ) {
    }

    @Public()
    @Get()
    async findAll() {
        return await this.maturityLevelService.findAll();
    }

    @Public()
    @Post('report')
    async getReport(@Body() body: Record<string, Record<string, number>>) {
        const values = Object.values(body);
        if (!body || values.length === 0)
            throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);

        return await this.maturityLevelService.getReport(values);
    }

    @Post('init')
    @UseInterceptors(FileInterceptor('file'))
    async init(@UploadedFile() file: Express.Multer.File) {
        await this.maturityLevelService.initFromXlsx(file);
        return {result: 'ok'}
    }
}
