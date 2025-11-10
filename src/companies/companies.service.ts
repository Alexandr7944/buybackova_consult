import {ForbiddenException, Inject, Injectable} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {CompaniesRepository} from "./infrastructure/companies.repository";
import {UserRequestAttributes} from "../users/types";
import {Sequelize} from "sequelize-typescript";
import {UsersService} from "../users/domain/users.service";

@Injectable()
export class CompaniesService {
    constructor(
        private readonly companiesRepository: CompaniesRepository,
        private readonly usersService: UsersService,
        @Inject(Sequelize) private readonly sequelize: Sequelize
    ) {
    }

    async create(user: UserRequestAttributes, createCompanyDto: CreateCompanyDto) {
        if (!user.isAdmin)
            throw new ForbiddenException('Forbidden');

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

    async findAll(user: UserRequestAttributes) {
        if (!user.isAdmin)
            return [];

        return await this.companiesRepository.findAll();
    }

    findOne(id: number) {
        return `This action returns a #${id} company`;
    }

    async update(user: UserRequestAttributes, id: number, updateCompanyDto: UpdateCompanyDto) {
        if (!user.isAdmin)
            throw new ForbiddenException('Forbidden');

        const {name, ownerId, users} = updateCompanyDto;
        await this.companiesRepository.update(id, {name, ownerId});
        await this.usersService.updateCompanyId([ownerId].concat(users || []), id);
        return {success: true};
    }

    remove(id: number) {
        return `This action removes a #${id} company`;
    }
}
