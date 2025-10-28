import {Inject, Injectable} from '@nestjs/common';
import {CreateAuditDto} from '../dto/create-audit.dto';
import {UpdateAuditDto} from '../dto/update-audit.dto';
import {AuditsRepository} from "../infrastructure/audits.repository";
import {UserRequestAttributes} from "../../users/types";
import {Transaction} from "sequelize";
import {Sequelize} from "sequelize-typescript";
import {MaturityLevelService, ReportItem} from "../../maturity-level/maturity-level.service";
import {Audit} from "../infrastructure/models/audit.model";

type ReportItemsType = {
    category: Array<ReportItem>
    section: Array<ReportItem>
}

@Injectable()
export class AuditsService {
    constructor(
        private readonly auditsRepository: AuditsRepository,
        private readonly maturityLevelService: MaturityLevelService,
        @Inject(Sequelize) private readonly sequelize: Sequelize,
    ) {
    }

    async create(createAuditDto: CreateAuditDto) {
        let transaction = await this.sequelize.transaction();

        try {
            const {total, ...reportItems} = await this.maturityLevelService.getReport(createAuditDto.formState);

            const audit: Audit = await this.auditsRepository.createAudit({
                ...createAuditDto,
                resultValue:       total.totalValue ?? 0,
                resultDescription: total.description ?? '',
            }, transaction);

            const auditReports = Object.entries(reportItems)
                .map(([type, reports]: [string, ReportItem[]]) =>
                    reports.map(item => ({
                        auditId:          audit.id,
                        type,
                        title:            item.title,
                        total:            item.total,
                        resultByQuestion: item.resultByQuestion
                    }))
                )
                .flat();

            await this.auditsRepository.createReports(auditReports, transaction);
            await transaction.commit();
            return await this.auditsRepository.findOne(audit.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findOne(id: number) {
        return await this.auditsRepository.findOne(id);
    }

    async update(id: number, updateAuditDto: UpdateAuditDto) {
        let transaction = await this.sequelize.transaction();
        const value = {...updateAuditDto};

        try {
            if (value.formState) {
                const total = await this.updateAuditReports(id, updateAuditDto, transaction);
                value.resultValue = total.totalValue ?? 0;
                value.resultDescription = total.description ?? '';
            }

            await this.auditsRepository.update(id, value, transaction);

            await transaction.commit();

            return await this.auditsRepository.findOne(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    private async createAuditReports(reportItems: ReportItemsType, auditId: number, transaction: Transaction) {
        const auditReports = Object.entries(reportItems)
            .map(([type, reports]: [string, ReportItem[]]) =>
                reports.map(item => ({
                    auditId:          auditId,
                    type,
                    title:            item.title,
                    total:            item.total,
                    resultByQuestion: item.resultByQuestion
                }))
            )
            .flat();
        await this.auditsRepository.createReports(auditReports, transaction);
    }

    private async updateAuditReports(auditId: number, updateAuditDto: UpdateAuditDto, transaction: Transaction) {
        const deletedCount = await this.auditsRepository.deleteReportByAuditId(auditId, transaction);
        const {total, ...reportItems} = await this.maturityLevelService.getReport(updateAuditDto.formState);

        if (deletedCount)
            await this.createAuditReports(reportItems, auditId, transaction);

        return total;
    }

    async remove(user: UserRequestAttributes, id: number) {
        return `This action removes a #${id} audit`;
        // if (req.user.roles.some(item => ['admin', 'auditor'].includes(item))) {
        // } else {
        //     throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        // }
    }
}
