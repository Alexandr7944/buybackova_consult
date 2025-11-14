import {InjectModel} from "@nestjs/sequelize";
import {Audit} from "./models/audit.model";
import {AuditResults} from "./models/audit-results.model";
import {CreateAuditDto} from "../dto/create-audit.dto";
import {Transaction} from "sequelize";
import {CreateAuditResultsDto} from "../dto/create-audit-results.dto";
import {AuditableObject} from "@/auditable-object/infrastructure/auditable-object.model";

export class AuditsRepository {
    constructor(
        @InjectModel(Audit) private readonly auditModel: typeof Audit,
        @InjectModel(AuditResults) private readonly auditResultsModel: typeof AuditResults,
        @InjectModel(AuditableObject) private readonly auditableObjectModel: typeof AuditableObject,
    ) {
    }

    async createAudit(createAuditDto: CreateAuditDto, transaction: Transaction) {
        return await this.auditModel.create(createAuditDto, {transaction});
    }

    async createReports(auditReports: CreateAuditResultsDto[], transaction: Transaction) {
        return await this.auditResultsModel.bulkCreate(auditReports, {transaction});
    }

    async findOne(id: number) {
        return await this.auditModel.findByPk(id, {
            include: [
                {
                    model:      this.auditResultsModel,
                    as:         'results',
                    attributes: ['id', 'title', 'type', 'total', 'resultByQuestion', 'percentage'],
                    order:      [['type', 'ASC']]
                },
                {
                    model: this.auditableObjectModel,
                    as:    'object'
                }
            ]
        });
    }

    async update(id: number, updateAuditDto: any, transaction: Transaction) {
        return this.auditModel.update(updateAuditDto, {
            where: {id},
            transaction
        });
    }


    async deleteReportByAuditId(auditId: number, transaction: Transaction) {
        return await this.auditResultsModel.destroy({
            where: {auditId},
            transaction
        })
    }

    async remove(auditId: number, transaction: Transaction) {
        await this.deleteReportByAuditId(auditId, transaction);
        return await this.auditModel.destroy({
            where: {
                id: auditId,
            },
            transaction
        });
    }
}
