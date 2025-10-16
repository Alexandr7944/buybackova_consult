import {Injectable} from '@nestjs/common';
import {UsersRepository} from "./users.repository";

export type User = any;

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {
    }

    async findOne(username: string): Promise<User | undefined> {
        return await this.usersRepository.findOne(username);
    }
}
