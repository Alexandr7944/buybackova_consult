import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {CreateAuditDto} from '../dto/create-audit.dto';
import {UpdateAuditDto} from '../dto/update-audit.dto';
import {AuditsRepository} from "../infrastructure/audits.repository";
import {UserRequestAttributes} from "@/users/types";
import {Transaction} from "sequelize";
import {Sequelize} from "sequelize-typescript";
import {MaturityLevelService, ReportItem} from "@/maturity-level/domain/maturity-level.service";
import {Audit} from "../infrastructure/models/audit.model";
import * as XLSX from "xlsx-js-style";
import {XlsxHelper} from "@/common/xlsx/xlsx.reader";
import {format} from "date-fns";

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

    async remove(user: UserRequestAttributes, auditId: number) {
        const isAdmin = user.roles.some(item => ['admin'].includes(item));
        let transaction = await this.sequelize.transaction();

        try {
            if (isAdmin) {
                const deleted = await this.auditsRepository.remove(auditId, transaction);
                if (!deleted)
                    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

                await transaction.commit();
                return {success: true};
            }

            // const audit = await this.auditsRepository.findOne(auditId);
            // const isOwner = user.id === audit?.object?.ownerId;
            //
            // if (isOwner) {
            //     const deleted = await this.auditsRepository.remove(auditId, transaction);
            //     await transaction.commit();
            //     return {success: true};
            // }

            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async downloadReportXlsx(id: number) {
        const audit = await this.findOne(id);
        if (!audit)
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

        const wb = XLSX.utils.book_new();
        const rows = [
            [{v: "Протокол аудита", t: 's', s: {font: {bold: true}}}],
            [],
            ...[["Название объекта:", audit.object.name],
                ["Адрес объекта:", audit.object.address],
                ["Аудитор:", audit.auditorName],
                ["Представитель заказчика:", audit.ownerSignerName],
                ["Дата оценки:", format(audit.date || audit.createdAt, 'dd.MM.yyyy')],
                ["Общая оценка уровня развития системы управления клиентским опытом:", audit.resultValue ? audit.resultValue + '%' : 0],
                ["Уровень зрелости:", audit.resultDescription]]
                .map(([title, value]) => [
                {v: title, t: 's', s: {border: this.border, alignment: {wrapText: true, vertical: 'top', horizontal: 'left'}}},
                {v: value, t: 's', s: {border: this.border, alignment: {wrapText: true, vertical: 'top', horizontal: 'left'}}},
            ]),
            this.rowBorder,
            ...this.getReportTable(audit, "Анализ по разделам стандарта ISO 23592:2021", "section", audit.sectionDescription),
            this.rowBorder,
            ...this.getReportTable(audit, "Анализ по категориям СХ-системы", "category", audit.categoryDescription),
            this.rowBorderTop,
            [{v: audit.reportDescription || '', t: 's', s: {alignment: {wrapText: true, vertical: 'top', horizontal: 'left'}}}]
        ];
        const ws: Record<string, any> = XLSX.utils.aoa_to_sheet(rows)
        ws['!cols'] = [{wch: 70}, {wch: 25}];

        const rowDescriptionIndex = [20, 34, 36];
        ws['!rows'] = rows.map((row, index) =>
            rowDescriptionIndex.includes(index) ? {
                hpx: XlsxHelper.calculateRowHeight(
                    ws[XLSX.utils.encode_cell({r: index, c: 0})]?.v,
                    ws['!cols'][0].wch + ws['!cols'][1].wch
                )
            } : {
                hpx: XlsxHelper.calculateRowHeight(
                    ws[XLSX.utils.encode_cell({r: index, c: 0})]?.v,
                    ws['!cols'][0].wch
                )
            }
        );
        ws['!merges'] = [
            {s: {r: 0, c: 0}, e: {r: 0, c: 1}},
            {s: {r: 10, c: 0}, e: {r: 10, c: 1}},
            {s: {r: 20, c: 0}, e: {r: 20, c: 1}},
            {s: {r: 22, c: 0}, e: {r: 22, c: 1}},
            {s: {r: 34, c: 0}, e: {r: 34, c: 1}},
            {s: {r: 36, c: 0}, e: {r: 36, c: 1}},
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Отчет');

        return XLSX.write(wb, {
            type:       'buffer',
            bookType:   'xlsx',
            cellStyles: true
        });
    }

    get border() {
        return {
            top:    {style: 'thin', color: {rgb: "000000"}},
            bottom: {style: 'thin', color: {rgb: "000000"}},
            left:   {style: 'thin', color: {rgb: "000000"}},
            right:  {style: 'thin', color: {rgb: "000000"}},
        }
    }

    get rowBorder() {
        return [{
            v: "", t: 's', s: {
                border: {
                    top:    {style: 'thin', color: {rgb: "000000"}},
                    bottom: {style: 'thin', color: {rgb: "000000"}},
                }
            }
        }, {
            v: "", t: 's', s: {
                border: {
                    top:    {style: 'thin', color: {rgb: "000000"}},
                    bottom: {style: 'thin', color: {rgb: "000000"}},
                }
            }
        }]
    }

    get rowBorderTop() {
        return [{
            v: "", t: 's', s: {
                border: {
                    top: {style: 'thin', color: {rgb: "000000"}},
                }
            }
        }, {
            v: "", t: 's', s: {
                border: {
                    top: {style: 'thin', color: {rgb: "000000"}},
                }
            }
        }]
    }

    getReportTable(audit: Audit, title: string, type: string, description: string) {
        return [
            [
                {
                    v: title,
                    t: 's',
                    s: {border: this.border, font: {bold: true}}
                },
                {
                    v: "",
                    t: 's',
                    s: {border: this.border}
                }
            ],
            [
                {
                    v: "Тип",
                    t: 's',
                    s: {border: this.border, font: {bold: true}}
                },
                {
                    v: "Результат",
                    t: 's',
                    s: {border: this.border, font: {bold: true}}
                }
            ],
            ...audit.results
                .filter((audit) => audit.type === type)
                .map(report => [
                    {v: report.title, t: 's', s: {border: this.border}},
                    {
                        v: report.percentage ? report.percentage + '%' : 0,
                        t: 's',
                        s: {border: this.border}
                    },
                ]),
            this.descriptionStyle(description),
        ]
    }

    descriptionStyle(text: string) {
        return [{
            v: text || '',
            t: 's',
            s: {
                border:    this.border,
                alignment: {wrapText: true, vertical: 'top', horizontal: 'left'}
            }
        }, {v: "", t: 's', s: {border: this.border}}]
    }
}
