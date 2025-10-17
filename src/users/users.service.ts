import {Injectable} from '@nestjs/common';
import {UsersRepository} from "./users.repository";
import {LoginDto} from "../auth/dto/login.dto";
import {UserAttributes} from "./users.model";

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {
    }

    async create(body: LoginDto): Promise<UserAttributes> {
        const user = await this.usersRepository.create(body);
        return user.dataValues;
    }

    async findOne(username: string): Promise<UserAttributes | undefined> {
        return await this.usersRepository.findOne(username);
    }

    async update(id: number, data: Partial<UserAttributes>): Promise<boolean> {
        const [count] = await this.usersRepository.update(id, data);
        return Boolean(count);
    }
}
