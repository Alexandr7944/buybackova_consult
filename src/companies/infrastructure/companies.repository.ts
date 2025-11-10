import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {CreateCompanyDto} from '../dto/create-company.dto';
import {Company} from "./models/company.model";
import {Users} from "../../users/infrastructure/models/users.model";
import {Transaction} from "sequelize";
import {UpdateCompanyDto} from "../dto/update-company.dto";

@Injectable()
export class CompaniesRepository {
    constructor(
        @InjectModel(Company) private companyModel: typeof Company,
    ) {
    }

    async create(company: CreateCompanyDto, transaction: Transaction): Promise<Company> {
        return await this.companyModel.create(company, {
            transaction
        });
    }

    async findOne(id: number): Promise<Company | null> {
        return await this.companyModel.findByPk(id);
    }

    async findAll(): Promise<Company[]> {
        return await this.companyModel.findAll({
            attributes: ['id', 'name', 'ownerId'],
            include:    [
                {
                    model:      Users,
                    as:         "users",
                    attributes: ['id', 'name'],
                },
                {
                    model:      Users,
                    as:         'owner',
                    attributes: ['id', 'name'],
                }
            ],
            order:      [['id', 'ASC']]
        });
    }

    async update(id: number, company: UpdateCompanyDto) {
        const [count] = await this.companyModel.update({
            name:    company.name,
            ownerId: company.ownerId,
        }, {
            where: {id},
        });
        return Boolean(count);
    }
}
