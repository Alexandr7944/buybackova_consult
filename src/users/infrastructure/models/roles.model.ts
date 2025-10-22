import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Users } from "./users.model";
import { UserRole } from "./user-roles.model";

@Table({
  tableName: "roles",
  timestamps: true,
})
export class Role extends Model<Role> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(64),
    validate: {
      notEmpty: { msg: "Имя роли не может быть пустым" },
      len: { args: [2, 64], msg: "Имя роли должно быть 2-64 символа" },
    },
  })
  declare name: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(64),
    validate: {
      is: /^[a-z0-9-]+$/i,
      len: { args: [2, 64], msg: "Slug роли должно быть 2-64 символа" },
    },
  })
  declare slug: string;

  @BelongsToMany(() => Users, () => UserRole)
  declare users?: Users[];
}
