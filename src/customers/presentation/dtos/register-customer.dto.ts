import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterCustomerDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    firstName: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    lastName: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;
}