import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users} from 'src/models/users.model';
import { BaseService } from 'src/core/base.service';

@Injectable()
export class UsersService extends BaseService<Users>{
    constructor(@InjectModel('Users') private readonly usersModel: Model<Users>) {
        super(usersModel);
    }
}
