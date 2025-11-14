import {Controller, Get, Post, Body, Patch, Param} from '@nestjs/common';
import {CompaniesService} from './companies.service';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {ForAdmin} from "@/auth/decorators/for-admin.decorator";

@Controller('companies')
export class CompaniesController {
    constructor(
        private readonly companiesService: CompaniesService
    ) {
    }

    @ForAdmin()
    @Post()
    async create(@Body() createCompanyDto: CreateCompanyDto) {
        return await this.companiesService.create(createCompanyDto);
    }

    @ForAdmin()
    @Get()
    async findAll() {
        return await this.companiesService.findAll();
    }

    @ForAdmin()
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto
    ) {
        return await this.companiesService.update(+id, updateCompanyDto);
    }
}
