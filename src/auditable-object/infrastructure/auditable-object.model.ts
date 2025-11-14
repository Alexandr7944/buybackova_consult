import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import {CreateAuditableObjectDto} from "../dto/create-auditable-object.dto";
import {Audit} from "@/audits/infrastructure/models/audit.model";
import {Company} from "@/companies/infrastructure/models/company.model";

@Table({
    tableName:  'auditable_objects',
    timestamps: true,
    paranoid:   true,
})

export class AuditableObject extends Model<AuditableObject, CreateAuditableObjectDto> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare address: string;

    @HasMany(() => Audit)
    declare audits: Audit[];

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare companyId: number;
}

