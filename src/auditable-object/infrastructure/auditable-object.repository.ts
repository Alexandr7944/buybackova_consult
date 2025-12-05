import {Injectable} from "@nestjs/common";
import {CreateAuditableObjectDto} from "../dto/create-auditable-object.dto";
import {UpdateAuditableObjectDto} from "../dto/update-auditable-object.dto";
import {InjectModel} from "@nestjs/sequelize";
import {AuditableObject} from "./auditable-object.model";
import {Audit} from "@/audits/infrastructure/models/audit.model";
import {Sequelize} from "sequelize-typescript";
import {WhereOptions} from "sequelize";

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

    async findAll(params?: { where?: WhereOptions<AuditableObject> }) {
        return await this.auditableObjectModel.findAll({
            where:      params?.where || {},
            attributes: ['id', 'name', 'address', 'companyId',
                [Sequelize.fn('COUNT', Sequelize.col('audits.id')), 'auditCount']
            ],
            include:    [
                {
                    model:      this.auditModel,
                    as:         'audits',
                    attributes: [],
                    required:   false,
                }
            ],
            group:      [this.auditableObjectModel.name + '.id'],
            order:      [['createdAt', 'DESC']],
        });
    }

    async findOne(id: number) {
        return await this.auditableObjectModel.findByPk(id, {
            attributes: ['id', 'name', 'address', 'companyId'],
            include:    [
                {
                    model:      this.auditModel,
                    as:         'audits',
                    attributes: ['id', 'resultValue', 'resultDescription', 'createdAt', 'date'],
                }
            ],
        });
    }

    async update(id: number, updateAuditableObjectDto: UpdateAuditableObjectDto) {
        return await this.auditableObjectModel.update(updateAuditableObjectDto, {
            where: {id},
        });
    }
}
