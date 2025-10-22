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
import { Role } from "./roles.model";
import { UserRole } from "./user-roles.model";
import { Profile } from "./profile.model";

export interface UserAttributes {
  id: number;
  refreshToken?: string | null;
  updatedAt?: Date;
  createdAt?: Date;
}

@Table({
  tableName: "users",
  timestamps: true,
})
export class Users extends Model<Users, {}> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // Единый refreshToken для пользователя (nullable для инвалидирования)
  @AllowNull(true)
  @Column(DataType.STRING)
  declare refreshToken: string | null;

  // Associations
  @BelongsToMany(() => Role, () => UserRole)
  declare roles?: Array<Role & { UserRole: UserRole }>;

  @HasMany(() => Profile)
  declare profiles?: Profile[];
}
