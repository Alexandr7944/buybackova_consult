import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {CxMaturitySections} from "./cx_maturity_sections.models";
import {CreateMaturityQuestionDto} from "../dto/create-maturity-level.dto";
import {CxMaturityCategories} from "./cx_maturity_categories.models";

@Table({
    timestamps: false,
    tableName: 'cx_maturity_questions',
})
export class CxMaturityQuestions extends Model<CxMaturityQuestions, CreateMaturityQuestionDto> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
    })
    declare id?: number;

    @Column({
        type:      DataType.TEXT,
        allowNull: false,
    })
    declare standard: string;

    @Column({
        type:      DataType.TEXT,
        allowNull: false,
    })
    declare question: string;

    @ForeignKey(() => CxMaturityCategories)
    @Column({
        type:      DataType.INTEGER,
        allowNull: false,
    })
    declare categoryId: string;

    @ForeignKey(() => CxMaturitySections)
    @Column({
        type:      DataType.INTEGER,
        allowNull: false,
    })
    declare sectionId: number;
}
