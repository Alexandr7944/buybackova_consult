import {Controller, Req, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {AuditsService} from './domain/audits.service';
import {CreateAuditDto} from './dto/create-audit.dto';
import {UpdateAuditDto} from './dto/update-audit.dto';
import {UserRequest} from "@/users/types";
import {ForAdmin} from "@/auth/decorators/for-admin.decorator";

@Controller('audits')
export class AuditsController {
    constructor(private readonly auditsService: AuditsService) {
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
