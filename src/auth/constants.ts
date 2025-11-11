import env from "../config/env/env";

export const jwtConstants = {
    JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
};
