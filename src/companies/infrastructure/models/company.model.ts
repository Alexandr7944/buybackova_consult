import {AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique} from "sequelize-typescript";
import {Users} from "../../../users/infrastructure/models/users.model";
import {AuditableObject} from "../../../auditable-object/infrastructure/auditable-object.model";
import {CreateCompanyDto} from "../../dto/create-company.dto";

@Table({
    tableName:  "companies",
    timestamps: true,
    paranoid:   true,
})

export class Company extends Model<Company, CreateCompanyDto> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    declare name: string;

    @ForeignKey(() => Users)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    declare ownerId: number;

    @BelongsTo(() => Users)
    declare owner?: Users;

    @HasMany(() => Users)
    declare users?: Users[];

    @HasMany(() => AuditableObject)
    declare objects?: AuditableObject[];
}
