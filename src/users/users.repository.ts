import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {UserAttributes, Users} from "./users.model";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(Users) private readonly usersModel: typeof Users
    ) {
    }

    async create(body: any) {
        return await this.usersModel.create(body);
    }

    async findOne(username: string): Promise<UserAttributes | undefined> {
        const result = await this.usersModel.findOne({
            where: {username}
        });

        return result?.dataValues;
    }

    async update(body: any) {
        return await this.usersModel.update(body, {
            where: {id: body.id}
        });
    }
}
