import {
    AllowNull,
    AutoIncrement,
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import {Role} from "./roles.model";
import {UserRole} from "./user-roles.model";
import {Profile} from "./profile.model";

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

    // Associations
    @BelongsToMany(() => Role, () => UserRole)
    declare roles?: Array<Role & { UserRole: UserRole }>;

    @HasMany(() => Profile)
    declare profiles?: Profile[];
}
