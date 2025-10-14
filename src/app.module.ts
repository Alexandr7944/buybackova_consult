import {Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {MaturityLevelModule} from './maturity-level/maturity-level.module';
import config from './config/db.config';

@Module({
    imports: [
        SequelizeModule.forRoot(config),
        MaturityLevelModule
    ],
})
export class AppModule {
}
