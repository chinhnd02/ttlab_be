import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import ConfigKey from '../config/config-key';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    uri: `mongodb+srv://training:<ducchinh123>@cluster0.taxzom7.mongodb.net/
                    `
                };
            },
        }),
    ],
    providers: [],
})
export class MongoModule { }
