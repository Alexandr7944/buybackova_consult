import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {CxMaturityQuestions} from "./cx_maturity_questions.models";
import {CreateMaturitySectionDto} from "../../dto/create-maturity-level.dto";

@Table({
    timestamps: false,
    tableName:  'cx_maturity_sections',
})
export class CxMaturitySections extends Model<CreateMaturitySectionDto> {
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
    declare rows: CxMaturityQuestions[];
}
