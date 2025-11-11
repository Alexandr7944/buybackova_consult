import {z} from 'zod';
import {configDotenv} from 'dotenv';

configDotenv();

const envSchema = z.object({
    NODE_ENV:           z.union([z.undefined(), z.enum(['development', 'production'])]),
    DB_HOST:            z.union([z.undefined(), z.string()]),
    DB_PORT:            z
                            .string()
                            .regex(/^[0-9]+$/)
                            .transform((value) => parseInt(value)),
    DB_NAME:            z.string(),
    DB_USER:            z.string(),
    DB_PASSWORD:        z.string(),
    APP_PORT:           z.string()
                            .regex(/^[0-9]+$/)
                            .transform((value) => parseInt(value)),
    JWT_ACCESS_SECRET:  z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
});

const env = envSchema.parse({
    DB_HOST:            process.env.DB_HOST,
    DB_PORT:            process.env.DB_PORT,
    DB_NAME:            process.env.DB_NAME,
    DB_USER:            process.env.DB_USER,
    DB_PASSWORD:        process.env.DB_PASSWORD,
    NODE_ENV:           process.env.NODE_ENV,
    APP_PORT:           process.env.APP_PORT,
    JWT_ACCESS_SECRET:  process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
});

export default env;
