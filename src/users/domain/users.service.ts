import {Inject, Injectable} from '@nestjs/common';
import {UsersRepository} from "../infrastructure/users.repository";
import {LoginDto} from "../../auth/dto/login.dto";
import {UserAttributes, Users} from "../infrastructure/models/users.model";
import sequelize from "sequelize";
import {Sequelize} from "sequelize-typescript";
import {Profile} from "../infrastructure/models/profile.model";

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        @Inject(Sequelize) private readonly sequelize: Sequelize
    ) {
    }

    async create(body: LoginDto): Promise<any> {
        let transaction: sequelize.Transaction | null = null;

        try {
            transaction = await this.sequelize.transaction();
            const user = await this.usersRepository.create(transaction);
            const localProfile = await this.usersRepository.createLocalProfile(user.id, body, transaction);
            const role = await this.usersRepository.setUserRole(user.id, 'guest', transaction);

            await transaction.commit();
            return {id: user.id, username: localProfile.providerUserId};
        } catch (e) {
            await transaction?.rollback();
            throw e;
        }
    }

    async findOne(id: number): Promise<Users | null> {
        return await this.usersRepository.findOne(id);
    }

    async findLocalProfile(username: string): Promise<Profile | undefined> {
        return await this.usersRepository.findLocalProfile(username);
    }

    async update(id: number, data: Partial<UserAttributes>): Promise<boolean> {
        const [count] = await this.usersRepository.update(id, data);
        return Boolean(count);
    }
}
