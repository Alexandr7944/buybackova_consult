import {AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Audit} from "./audit.model";
import {CreateAuditResultsDto} from "../../dto/create-audit-results.dto";

@Table({
    tableName:  "audit_results",
    timestamps: true,
})

export class AuditResults extends Model<AuditResults, CreateAuditResultsDto> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Audit)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare auditId: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare type: string; // "category" | "section"

    @AllowNull(false)
    @Column(DataType.STRING)
    declare title: string;

    @AllowNull(false)
    @Column(DataType.FLOAT)
    declare total: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare resultByQuestion: number;

    @Column({
        type: DataType.VIRTUAL,
        get(this: AuditResults) {
            const totals = this.getDataValue('total');
            const resultByQuestion = this.getDataValue('resultByQuestion');
            return +(resultByQuestion / totals * 100).toFixed(2);
        }
    })
    declare percentage: number;
    
    @BelongsTo(() => Audit)
    declare audit: Audit;
}
