import { Body, Controller, Post, Res, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    async login(@Res() response, @Request() req){
        try {
            const user = await this.authService.validateUser(req.body);
            if(!user.success){
                return response.status(HttpStatus.UNAUTHORIZED).json(user);
            }
            const data = await this.authService.login(req.body);
            return response.status(HttpStatus.OK).json(data);
        } catch (err) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: Authentication Failed!',
                error: 'Bad Request'
            });
        }
    }

    @Post('signup')
    async signup(@Body() user: CreateUserDto){
        return await this.authService.create(user);
    }
    
}
