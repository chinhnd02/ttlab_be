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
                    uri: `mongodb+srv://ducchinhcp882002:<ducchinh123>@cluster0.40211mm.mongodb.net/`
                };
            },
        }),
    ],
    providers: [],
})
export class MongoModule { }
