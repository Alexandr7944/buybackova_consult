import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {CxMaturityQuestions} from "./cx_maturity_questions.models";
import {CreateMaturityCategoryDto} from "../../dto/create-maturity-level.dto";

@Table({
    timestamps: false,
    tableName:  'cx_maturity_categories',
})
export class CxMaturityCategories extends Model<CreateMaturityCategoryDto> {
    @Column({
        type:       DataType.INTEGER,
        primaryKey: true,
        allowNull:  false,
    })
    declare id?: number;

    @Column({
        type:      DataType.STRING,
        allowNull: false,
        unique:    true,
    })
    declare title: string;

    @HasMany(() => CxMaturityQuestions)
    declare questions: CxMaturityQuestions[];
}
