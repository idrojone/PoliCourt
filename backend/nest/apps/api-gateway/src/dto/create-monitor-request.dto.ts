import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateMonitorRequestDto {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 500, { message: 'La descripción debe tener entre 10 y 500 caracteres' })
    description!: string;

}