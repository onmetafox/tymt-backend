import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users} from 'src/models/users.model';
import { BaseService } from 'src/core/base.service';

@Injectable()
export class AuthService extends BaseService<Users>{
    ;

    constructor(@InjectModel('Users') private readonly usersModel: Model<Users>, private readonly jwtService: JwtService) {
        super(usersModel);
    }

    async validateUser(user: any) {
        // find if user exist with this email
        const userData = await this.usersModel.findOne({email: user.email}).exec();
        if (!userData) {
            return {
                "success": false,
                "msg": "User is not existed!",
                "status": 401
            };
        }

        // find if user password match
        const match = await this.comparePassword(user.password, userData.password);
        if (!match) {
            return {
                "success": false,
                "msg": "User password is not matched",
                "status": 401
            };
        }

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = userData;
        return {
            "success": true,
            "data": result
        };
    }
    public async login(user) {
        const token = await this.generateToken(user);
        return { user, token };
    }
    public async create(user) {
        
        const token = await this.generateToken(user);

        const userData = await this.usersModel.findOne({email: user.email}).exec();
        if (userData) {
            return {
                "success": false,
                "msg": "User already existed!",
                "status": 401
            };
        }
        // hash the password
        const pass = await this.hashPassword(user.password);

        // create the user
        const newUser = await this.usersModel.create({ ...user, password: pass });
        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser.toJSON();

        // generate token

        // return the user and the token
        return { user: result };
    }
    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }
    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
    
}
