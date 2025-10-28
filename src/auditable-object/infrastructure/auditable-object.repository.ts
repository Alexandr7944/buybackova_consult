import {Injectable} from "@nestjs/common";
import {CreateAuditableObjectDto} from "../dto/create-auditable-object.dto";
import {UpdateAuditableObjectDto} from "../dto/update-auditable-object.dto";
import {InjectModel} from "@nestjs/sequelize";
import {AuditableObject} from "./auditable-object.model";
import {Audit} from "../../audits/infrastructure/models/audit.model";

@Injectable()
export class AuditableObjectRepository {
    constructor(
        @InjectModel(AuditableObject) private readonly auditableObjectModel: typeof AuditableObject,
        @InjectModel(Audit) private readonly auditModel: typeof Audit,
    ) {
    }

    async create(createAuditableObjectDto: CreateAuditableObjectDto) {
        return await this.auditableObjectModel.create(createAuditableObjectDto);
    }

    async findAll() {
        return await this.auditableObjectModel.findAll();
    }

    async findAllByUser(id: number) {
        return await this.auditableObjectModel.findAll({
            where: {ownerId: id},
        });
    }

    async findOne(id: number) {
        return await this.auditableObjectModel.findByPk(id, {
            attributes: ['id', 'name', 'address', 'ownerId'],
            include:    [
                {
                    model:      this.auditModel,
                    as:         'audits',
                    attributes: ['id', 'resultValue', 'resultDescription', 'createdAt'],
                    order:      [['createdAt', 'DESC']],
                }
            ]
        });
    }

    async update(id: number, updateAuditableObjectDto: UpdateAuditableObjectDto) {
        const {name, address} = updateAuditableObjectDto;
        return await this.auditableObjectModel.update({name, address}, {
            where: {id},
        });
    }
}
