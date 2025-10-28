import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Users} from "./models/users.model";
import {Transaction} from "sequelize";
import {Profile} from "./models/profile.model";
import {LoginDto} from "../../auth/dto/login.dto";
import {Role} from "./models/roles.model";
import {UserRole} from "./models/user-roles.model";
import assert from "node:assert";
import {UserAttributes} from "../types";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(Users) private readonly usersModel: typeof Users,
        @InjectModel(Profile) private readonly profileModel: typeof Profile,
        @InjectModel(Role) private readonly roleModel: typeof Role,
        @InjectModel(UserRole) private readonly userRoleModel: typeof UserRole,
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

    async setUserRole(userId: number, slug: string, transaction: Transaction) {
        const role = await this.findRoleIdBySlug(slug);
        assert.ok(role?.id, 'Role not found')
        await this.userRoleModel.create({userId, roleId: role.id,}, {transaction});
    }

    async findRoleIdBySlug(slug: string) {
        return await this.roleModel.findOne({
            where:      {slug},
            attributes: ['id']
        });
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
                }
            ]
        });
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


    async update(id: number, data: Partial<UserAttributes>) {
        return await this.usersModel.update(data, {
            where: {id}
        });
    }
}
