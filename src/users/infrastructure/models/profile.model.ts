import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Users } from "./users.model";

export type AuthProvider = "local" | "vk-id" | "yandex";

export type LocalProfileAttributes = {
    userId: number;
    provider: "local";
    providerUserId: string;
    username: string;
    passwordHash: string;
}

@Table({
  tableName: "profiles",
  timestamps: true,
})
export class Profile extends Model<Profile, LocalProfileAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Users)
  @AllowNull(false)
  @Index("ix_profiles_user_provider_providerUserId")
  @Column(DataType.INTEGER)
  declare userId: number;

  @AllowNull(false)
  @Index("ix_profiles_user_provider_providerUserId")
  @Column({
    type: DataType.ENUM("local", "vk-id", "yandex"),
  })
  declare provider: AuthProvider;

  // Внешний ID пользователя у провайдера (или локальный логин/email для local)
  @AllowNull(false)
  @Index("ix_profiles_user_provider_providerUserId")
  @Column({
    type: DataType.STRING(191),
  })
  declare providerUserId: string;

  // Только для provider="local": поля локальной аутентификации
  @AllowNull(true)
  @Unique // уникальный username в рамках всех профилей (альтернатива — unique составной на (provider, username))
  @Column(DataType.STRING(191))
  declare username?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare passwordHash?: string | null;

  // Общие доп. поля
  @AllowNull(true)
  @Column(DataType.STRING)
  declare displayName?: string | null;

  @AllowNull(true)
  @Column(DataType.JSONB)
  declare meta?: Record<string, unknown> | null;

  @BelongsTo(() => Users)
  declare user?: Users;
}
