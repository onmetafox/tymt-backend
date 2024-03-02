import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { UsersController } from "./users.controller";
import { UsersService } from './users.service';
import { UsersSchema } from 'src/models/users.model';

@Module({
    controllers: [UsersController],
    imports: [
        MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema}])
    ],
    providers: [
        UsersService,
        JwtService
    ]
})

export class UsersModule {}