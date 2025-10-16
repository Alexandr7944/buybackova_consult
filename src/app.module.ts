import {Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {MaturityLevelModule} from './maturity-level/maturity-level.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import config from './config/db.config';

@Module({
    imports: [
        SequelizeModule.forRoot(config),
        MaturityLevelModule,
        AuthModule,
        UsersModule
    ],
})
export class AppModule {
}
