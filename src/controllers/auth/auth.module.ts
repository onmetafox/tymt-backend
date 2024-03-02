import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from "./auth.controller";
import { AuthService } from './auth.service';
import { UsersSchema } from 'src/models/users.model';
@Module({
    controllers: [AuthController],
    imports: [
        MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema}]),
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => ({
            secret: config.get<string>('JWT_KEY'),
            signOptions: {
              expiresIn: config.get<string>('TOKEN_EXPIRATION')
            },
          }),
        }),
    ],
    providers: [
        AuthService,
    ]
})

export class AuthModule {}