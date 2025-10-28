import {Controller, Req, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {AuditsService} from './domain/audits.service';
import {CreateAuditDto} from './dto/create-audit.dto';
import {UpdateAuditDto} from './dto/update-audit.dto';
import {UserRequest} from "../users/types";
import {Public} from "../auth/SkipAuth";

@Controller('audits')
export class AuditsController {
    constructor(private readonly auditsService: AuditsService) {
    }

    @Public()
    @Post()
    async create(
        @Req() req: UserRequest,
        @Body() createAuditDto: CreateAuditDto
    ) {
        // data validate
        return await this.auditsService.create(createAuditDto);
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.auditsService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
        return await this.auditsService.update(+id, updateAuditDto);
    }

    @Delete(':id')
    async remove(
        @Req() req: UserRequest,
        @Param('id') id: string
    ) {
        return await this.auditsService.remove(req.user, +id);
    }
}
