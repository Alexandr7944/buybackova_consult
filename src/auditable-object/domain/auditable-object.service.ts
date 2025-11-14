import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateAuditableObjectDto} from '../dto/create-auditable-object.dto';
import {UpdateAuditableObjectDto} from '../dto/update-auditable-object.dto';
import {AuditableObjectRepository} from "../infrastructure/auditable-object.repository";
import {UserRequestAttributes} from "@/users/types";

@Injectable()
export class AuditableObjectService {
    constructor(
        private readonly auditableObjectRepository: AuditableObjectRepository,
    ) {
    }

    async create(createAuditableObjectDto: CreateAuditableObjectDto) {
        return await this.auditableObjectRepository.create(createAuditableObjectDto);
    }

    async findAll(user: UserRequestAttributes) {
        if (user.isAdmin)
            return await this.auditableObjectRepository.findAll();

        if (user.companyId)
            return await this.auditableObjectRepository.findAllByCompanyId(user.companyId);

        return [];
    }

    async findOne(user: UserRequestAttributes, id: number) {
        const result = await this.auditableObjectRepository.findOne(id);
        if (user.roles.includes('admin') || result?.companyId === user.companyId)
            return result;

        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    async update(id: number, updateAuditableObjectDto: UpdateAuditableObjectDto) {
        const [result] = await this.auditableObjectRepository.update(id, updateAuditableObjectDto);
        if (result)
            return result;

        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
}
