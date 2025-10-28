import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateAuditableObjectDto} from '../dto/create-auditable-object.dto';
import {UpdateAuditableObjectDto} from '../dto/update-auditable-object.dto';
import {AuditableObjectRepository} from "../infrastructure/auditable-object.repository";
import {UserRequestAttributes} from "../../users/types";

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
        if (user.roles.includes('admin'))
            return await this.auditableObjectRepository.findAll();
        else
            return await this.auditableObjectRepository.findAllByUser(user.id);
    }

    async findOne(user: UserRequestAttributes, id: number) {
        const result = await this.auditableObjectRepository.findOne(id);
        if (user.roles.includes('admin') || result?.ownerId === user.id)
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
