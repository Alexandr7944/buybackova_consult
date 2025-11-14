import {
    AllowNull,
    AutoIncrement, BelongsTo,
    BelongsToMany,
    Column,
    DataType, ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import {Role} from "./roles.model";
import {UserRole} from "./user-roles.model";
import {Profile} from "./profile.model";
import {Company} from "@/companies/infrastructure/models/company.model";

@Table({
    tableName:  "users",
    timestamps: true,
})
export class Users extends Model<Users, {}> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    declare refreshToken: string | null;

    @ForeignKey(() => Company)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    declare companyId: number | null;

    // Associations
    @BelongsToMany(() => Role, () => UserRole)
    declare roles?: Array<Role & { UserRole: UserRole }>;

    @HasMany(() => Profile)
    declare profiles?: Profile[];

    @BelongsTo(() => Company)
    declare company?: Company;
}
