import { Body, Controller, Post, Res, Get, HttpStatus, Put, Request, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { AuthGuard } from 'src/core/auth.strategy';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Put("/:id")
    async updateUser(){

    }
    @UseGuards(AuthGuard)
    @Get("/:id")
    async getUser(@Res() response, @Param('id') id: string){
        try{
            const user = await this.usersService.findOne(id);
            return response.status(HttpStatus.OK).json({
                message: 'Student found successfully',
                user
            })
        }catch (e){
            return response.status(e.status).json(e.response);
        }
    }
    
}
