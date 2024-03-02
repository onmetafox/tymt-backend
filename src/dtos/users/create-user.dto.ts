import { IsNotEmpty, IsEmail, IsString, IsNumber, MaxLength } from "class-validator";

export class CreateUserDto{
    @IsString()
    @MaxLength(10)
    @IsNotEmpty()
    readonly name: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly status: string;
}