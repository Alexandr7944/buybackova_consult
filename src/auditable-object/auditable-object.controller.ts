import {Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req} from '@nestjs/common';
import {AuditableObjectService} from './domain/auditable-object.service';
import {CreateAuditableObjectDto} from './dto/create-auditable-object.dto';
import {UpdateAuditableObjectDto} from './dto/update-auditable-object.dto';
import {UserRequest} from "@/users/types";

@Controller('auditable-object')
export class AuditableObjectController {
    constructor(private readonly auditableObjectService: AuditableObjectService) {
    }

    @Post()
    async create(
        @Req() req: UserRequest,
        @Body() createAuditableObjectDto: CreateAuditableObjectDto
    ) {
        const companyId = createAuditableObjectDto.companyId || req.user.companyId;
        if (!companyId)
            throw new HttpException('Invalid companyId', HttpStatus.BAD_REQUEST);

        return await this.auditableObjectService.create({
            companyId,
            name:      createAuditableObjectDto.name,
            address:   createAuditableObjectDto.address
        });
    }

    @Get()
    async findAll(@Req() req: UserRequest) {
        return await this.auditableObjectService.findAll(req.user);
    }

    @Get(':id')
    async findOne(
        @Req() req: UserRequest,
        @Param('id') id: string
    ) {
        const objectId = +id;
        if (!objectId)
            throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);

        return await this.auditableObjectService.findOne(req.user, objectId);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAuditableObjectDto: UpdateAuditableObjectDto) {
        return await this.auditableObjectService.update(+id, updateAuditableObjectDto);
    }
}
