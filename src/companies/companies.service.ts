import {Inject, Injectable} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {CompaniesRepository} from "./infrastructure/companies.repository";
import {Sequelize} from "sequelize-typescript";
import {UsersService} from "@/users/domain/users.service";

@Injectable()
export class CompaniesService {
    constructor(
        private readonly companiesRepository: CompaniesRepository,
        private readonly usersService: UsersService,
        @Inject(Sequelize) private readonly sequelize: Sequelize
    ) {
    }

    async create(createCompanyDto: CreateCompanyDto) {
        const transaction = await this.sequelize.transaction();
        try {
            const {name, ownerId, users} = createCompanyDto;
            const company = await this.companiesRepository.create({name, ownerId}, transaction);
            if (ownerId) {
                const usersIds = [ownerId].concat(users || []);
                await this.usersService.updateCompanyId(usersIds, company.id, transaction);
            }

            await transaction.commit();
            return {success: true};
        } catch (e) {
            await transaction.rollback();
        }
    }

    async findAll() {
        return await this.companiesRepository.findAll();
    }

    findOne(id: number) {
        return `This action returns a #${id} company`;
    }

    async update(id: number, updateCompanyDto: UpdateCompanyDto) {
        const {name, ownerId, users} = updateCompanyDto;
        await this.companiesRepository.update(id, {name, ownerId});
        const ids = users?.includes(ownerId) ? users : [ownerId].concat(users || []);
        await this.usersService.updateCompanyId(ids, id);
        return {success: true};
    }

    remove(id: number) {
        return `This action removes a #${id} company`;
    }
}
