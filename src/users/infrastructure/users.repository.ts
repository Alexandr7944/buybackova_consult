import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Users} from "./models/users.model";
import {Op, Transaction, WhereOptions} from "sequelize";
import {Profile} from "./models/profile.model";
import {LoginDto} from "@/auth/dto/login.dto";
import {Role} from "./models/roles.model";
import {UserRole} from "./models/user-roles.model";
import assert from "node:assert";
import {UserAttributes} from "../types";
import {Company} from "@/companies/infrastructure/models/company.model";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(Users) private readonly usersModel: typeof Users,
        @InjectModel(Profile) private readonly profileModel: typeof Profile,
        @InjectModel(Role) private readonly roleModel: typeof Role,
        @InjectModel(UserRole) private readonly userRoleModel: typeof UserRole,
        @InjectModel(Company) private readonly componyModel: typeof Company,
    ) {
    }

    async create(name: string, transaction: Transaction) {
        return await this.usersModel.create({name}, {transaction});
    }

    async createLocalProfile(userId: number, profile: LoginDto, transaction: Transaction) {
        return await this.profileModel.create({
            userId:         userId,
            provider:       'local',
            providerUserId: profile.username,
            username:       profile.username,
            passwordHash:   profile.password,
        }, {transaction});
    }

    async createUserRole(userId: number, slug: string, transaction: Transaction) {
        const roleId = await this.findRoleIdBySlug(slug);
        await this.userRoleModel.create({userId, roleId,}, {transaction});
    }

    private async findRoleIdBySlug(slug: string) {
        const role = await this.roleModel.findOne({
            where:      {slug},
            attributes: ['id']
        });
        assert.ok(role?.id, 'Role not found')
        return role.id;
    }

    async findOne(id: number) {
        return await this.usersModel.findOne({
            where:   {id},
            include: [
                {
                    model:      this.profileModel,
                    as:         'profiles',
                    attributes: ['provider', 'providerUserId', 'displayName']
                },
                {
                    model:      this.roleModel,
                    as:         'roles',
                    attributes: ['slug'],
                    through:    {attributes: []},
                },
                {
                    model:      this.componyModel,
                    as:         'company',
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    async findUsers(params?: { role?: string[], where?: WhereOptions<Users> }) {
        return await this.usersModel.findAll({
            attributes: ['id', 'name', 'companyId'],
            order:      [['name', 'ASC']],
            where:      params?.where || {},
            ...(params?.role ? {
                include: [
                    {
                        model:      this.roleModel,
                        as:         'roles',
                        where:      {slug: {[Op.in]: params.role}},
                        attributes: [],
                    }
                ]
            } : {})
        })
    }

    async findLocalProfile(username: string): Promise<Profile | undefined> {
        const profile = await this.profileModel.findOne({
            where: {
                username,
                provider: "local"
            }
        });
        return profile?.dataValues;
    }


    async update(id: number, data: Partial<UserAttributes>, transaction?: Transaction) {
        return await this.usersModel.update(data, {
            where: {id},
            ...(transaction ? {transaction} : {})
        });
    }

    async updateCompanyId(ids: number[], companyId: number | undefined, transaction?: Transaction) {
        return await this.usersModel.update({companyId}, {
            where: {id: {[Op.in]: ids}},
            ...(transaction ? {transaction} : {})
        });
    }

    async updateRole(ids: number[], role: string, transaction?: Transaction) {
        const roleId = await this.findRoleIdBySlug(role);
        assert.ok(roleId, `Role ${role} not found`)

        return this.userRoleModel.update({roleId}, {
            where: {userId: {[Op.in]: ids}},
            ...(transaction ? {transaction} : {})
        })
    }
}
