import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import env from './config/env/env';
import morgan from "morgan";
import helmet from "helmet";
import {Sequelize} from "sequelize-typescript";

require('console-stamp')(console, {
    format: ':date(dd.mm.yyyy HH:MM:ss.l) :label(10)'
});

async function bootstrap() {
    const isDevMode = env.NODE_ENV === 'development';

    const app = await NestFactory.create(AppModule, {
        abortOnError: false,
        cors: true,
    });

    app.use(morgan(isDevMode ? 'dev' : 'combined'));
    app.use(helmet());

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
