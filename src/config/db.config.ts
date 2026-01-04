import env from './env/env';
import {CxMaturitySections} from "@/maturity-level/infrastructure/models/cx_maturity_sections.models";
import {CxMaturityQuestions} from "@/maturity-level/infrastructure/models/cx_maturity_questions.models";
import {CxMaturityCategories} from "@/maturity-level/infrastructure/models/cx_maturity_categories.models";
import {CxMaturityTools} from "@/maturity-level/infrastructure/models/cx_maturity_tools.models";
import {Users} from "@/users/infrastructure/models/users.model";
import {Role} from "@/users/infrastructure/models/roles.model";
import {UserRole} from "@/users/infrastructure/models/user-roles.model";
import {Profile} from "@/users/infrastructure/models/profile.model";
import {AuditableObject} from "@/auditable-object/infrastructure/auditable-object.model";
import {Audit} from "@/audits/infrastructure/models/audit.model";
import {AuditResults} from "@/audits/infrastructure/models/audit-results.model";
import {Company} from "@/companies/infrastructure/models/company.model";

const options = {
    host:        env.DB_HOST,
    port:        env.DB_PORT,
    dialect:     'postgres' as const,
    synchronize: env.NODE_ENV === 'development',
    logging:     false,
    pool:        {max: 5, min: 0, acquire: 30000, idle: 10000},
};

console.log(`${options.host}:${options.port}/${env.DB_NAME}`);

const config = {
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    ...options,
    models: [
        Company,
        Users, Role, UserRole, Profile,
        AuditableObject, Audit, AuditResults,
        CxMaturityQuestions, CxMaturitySections, CxMaturityCategories, CxMaturityTools
    ],
};

export default config;
