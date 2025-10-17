import {Column, DataType, Model, Table} from "sequelize-typescript";

export interface UserAttributes {
    id: number;
    username: string;
    password: string;
    refreshToken: string;
    updatedAt?: Date;
    createdAt?: Date;
}

@Table({
    tableName:  'users',
    timestamps: true,
})

export class Users extends Model<Users> {
    @Column({
        type:          DataType.INTEGER,
        primaryKey:    true,
        autoIncrement: true,
    })
    declare id: number;

    @Column({
        type:      DataType.STRING,
        allowNull: false,
        unique:    true,
        validate:  {
            notEmpty: {msg: 'Логин не может быть пустым'},
            len:      {
                args: [3, 20],
                msg:  'Логин должен содержать от 3 до 20 символов'
            }
        },
    })
    declare username: string;

    @Column({
        type:      DataType.STRING,
        allowNull: false,
        unique:    true,
        validate:  {
            notEmpty: {msg: 'Пароль не может быть пустым'},
            len:      {
                args: [6, 155],
                msg:  'Пароль должен содержать от 6 до 50 символов'
            }
        },
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
    })
    declare refreshToken: string;
}
