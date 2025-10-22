import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Users } from "./users.model";
import { Role } from "./roles.model";

@Table({
  tableName: "users_roles",
  timestamps: true,
})
export class UserRole extends Model<UserRole, { userId: number; roleId: number }> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Users)
  @Index("ux_users_roles_user_role")
  @Column(DataType.INTEGER)
  declare userId: number;

  @ForeignKey(() => Role)
  @Index("ux_users_roles_user_role")
  @Column(DataType.INTEGER)
  declare roleId: number;
}
