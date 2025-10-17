import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import env from './config/env/env';
import morgan from "morgan";
import helmet from "helmet";
import {Sequelize} from "sequelize-typescript";
import cookieParser from "cookie-parser";

require('console-stamp')(console, {
    format: ':date(dd.mm.yyyy HH:MM:ss.l) :label(10)'
});

async function bootstrap() {
    const isDevMode = env.NODE_ENV === 'development';
    const corsOptions = {
        credentials: true,
        origin:      "http://localhost:5173",
    };

    const helmetOptions = {
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy:     {
            directives: {
                imgSrc:      [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
                scriptSrc:   [`'self'`, `https: 'unsafe-inline'`],
                manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
                frameSrc:    [`'self'`, 'sandbox.embed.apollographql.com'],
            },
        },
    }

    const app = await NestFactory.create(AppModule, {abortOnError: false});

    app.use(morgan(isDevMode ? 'dev' : 'combined'));
    app.use(cookieParser());
    app.use(helmet(helmetOptions));
    app.enableCors(corsOptions);

    const sequelize = app.get(Sequelize);
    await sequelize.sync({
        alter: isDevMode,
        // force: isDevMode,
    });

    await app.listen(env.APP_PORT, () => {
        console.log(`Server is running on port ${env.APP_PORT}.`);
    });
}

bootstrap();
