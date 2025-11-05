import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import {JSONB} from "sequelize";
import {AuditResults} from "./audit-results.model";
import {AuditableObject} from "../../../auditable-object/infrastructure/auditable-object.model";
import {CreateAuditDto} from "../../dto/create-audit.dto";

@Table({
    tableName:  'audits',
    timestamps: true,
    paranoid:   true,
})

export class Audit extends Model<Audit, CreateAuditDto> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => AuditableObject)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare objectId: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare auditorName: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare ownerSignerName: string;

    @AllowNull(false)
    @Column(JSONB)
    declare formState: string;

    @Column(DataType.DATE)
    declare date: number;

    @Column(DataType.FLOAT)
    declare resultValue: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        defaultValue: 'auditor'
    })
    declare author: string;     // auditor | user

    @Column(DataType.STRING)
    declare resultDescription: string;

    @Column(DataType.TEXT)
    declare categoryDescription: string;

    @Column(DataType.TEXT)
    declare sectionDescription: string;

    @Column(DataType.TEXT)
    declare reportDescription: string;

    @HasMany(() => AuditResults)
    declare results: AuditResults[];

    @BelongsTo(() => AuditableObject)
    declare object: AuditableObject;
}
