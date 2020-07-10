import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import Joi = require('@hapi/joi');

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // No need to import ConfigModule in other modules once it's been loaded in the root module
            envFilePath: '.development.env',
            expandVariables: true,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test', 'provision')
                    .default('development'),
                PORT: Joi.number().default(3000),
                DB_HOST: Joi.string(),
                // .uri(),
                // .allow('localhost')
                // .default('localhost'),
                DB_PORT: Joi.number().default(3306),
                DB_USERNAME: Joi.string(),
                DB_PASSWORD: Joi.string(),
                DB_NAME: Joi.string(),
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: false,
            },
        }),
    ],
})
export class ConfigurationModule {}
