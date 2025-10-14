import env from './env/env';
import {CxMaturitySections} from "../maturity-level/models/cx_maturity_sections.models";
import {CxMaturityQuestions} from "../maturity-level/models/cx_maturity_questions.models";
import {CxMaturityCategories} from "../maturity-level/models/cx_maturity_categories.models";

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
    models: [CxMaturityQuestions, CxMaturitySections, CxMaturityCategories],
};

export default config;
