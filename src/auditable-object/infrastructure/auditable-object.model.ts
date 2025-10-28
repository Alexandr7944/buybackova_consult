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
import {CreateAuditableObjectDto} from "../dto/create-auditable-object.dto";
import {Users} from "../../users/infrastructure/models/users.model";
import {Audit} from "../../audits/infrastructure/models/audit.model";

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

    @ForeignKey(() => Users)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    declare ownerId: number;

    @HasMany(() => Audit)
    declare audits: Audit[];

    @BelongsTo(() => Users)
    declare owner: Users;
}

