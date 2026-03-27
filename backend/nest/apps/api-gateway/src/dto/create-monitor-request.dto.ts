import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMonitorRequestDto {
    @ApiProperty({ example: 'juan.perez', description: 'Usuario que solicita el monitor' })
    @IsString()
    @IsNotEmpty()
    username!: string;

    @ApiProperty({ example: 'Necesito apoyo en cálculo integral', description: 'Descripción de la solicitud', minLength: 10, maxLength: 500 })
    @IsString()
    @IsNotEmpty()
    @Length(10, 500, { message: 'La descripción debe tener entre 10 y 500 caracteres' })
    description!: string;

}