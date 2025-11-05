import {Controller, Get, Req} from '@nestjs/common';
import {UsersService} from "./domain/users.service";
import {UserRequest} from "./types";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findUsers(@Req() req: UserRequest ): Promise<{id: number, name: string}[]> {
        if (!req.user.roles.includes('admin'))
            return [];

        return await this.usersService.findUsers();
    }
}
