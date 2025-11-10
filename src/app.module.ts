import {Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {MaturityLevelModule} from './maturity-level/maturity-level.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditableObjectModule } from './auditable-object/auditable-object.module';
import { AuditsModule } from './audits/audits.module';
import { CompaniesModule } from './companies/companies.module';
import config from './config/db.config';

@Module({
    imports: [
        SequelizeModule.forRoot(config),
        MaturityLevelModule,
        AuthModule,
        UsersModule,
        AuditableObjectModule,
        AuditsModule,
        CompaniesModule,
    ],
})
export class AppModule {
}
