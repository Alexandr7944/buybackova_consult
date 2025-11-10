import {Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common';
import {CompaniesService} from './companies.service';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {UserRequest} from "../users/types";

@Controller('companies')
export class CompaniesController {
    constructor(
        private readonly companiesService: CompaniesService
    ) {
    }

    @Post()
    async create(@Req() req: UserRequest, @Body() createCompanyDto: CreateCompanyDto) {
        return await this.companiesService.create(req.user, createCompanyDto);
    }

    @Get()
    async findAll(@Req() req: UserRequest) {
        return await this.companiesService.findAll(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(+id);
    }

    @Patch(':id')
    async update(
        @Req() req: UserRequest,
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto
    ) {
        return await this.companiesService.update(req.user, +id, updateCompanyDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.companiesService.remove(+id);
    }
}
