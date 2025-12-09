import {Controller, Req, Get, Post, Body, Patch, Param, Delete, Res} from '@nestjs/common';
import {AuditsService} from './domain/audits.service';
import {CreateAuditDto} from './dto/create-audit.dto';
import {UpdateAuditDto} from './dto/update-audit.dto';
import {UserRequest} from "@/users/types";
import {ForAdmin} from "@/auth/decorators/for-admin.decorator";
import {Public} from "@/auth/decorators/skip-auth.decorator";
import type {Response} from "express";

@Controller('audits')
export class AuditsController {
    constructor(private readonly auditsService: AuditsService) {
    }

    @Public()
    @Get('report-xlsx/:id')
    async downloadReportXlsx(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        const xlsxBuffer = await this.auditsService.downloadReportXlsx(+id);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
        res.send(xlsxBuffer);
    }

    @ForAdmin()
    @Post()
    async create(
        @Body() createAuditDto: CreateAuditDto
    ) {
        return await this.auditsService.create(createAuditDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.auditsService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
        return await this.auditsService.update(+id, updateAuditDto);
    }

    @ForAdmin()
    @Delete(':id')
    async remove(
        @Req() req: UserRequest,
        @Param('id') id: string
    ) {
        return await this.auditsService.remove(req.user, +id);
    }
}
