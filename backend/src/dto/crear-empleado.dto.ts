import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CrearEmpleadoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  apellido: string;

  @IsString()
  @IsNotEmpty({ message: 'El CUIL es obligatorio.' })
  @Matches(/^\d{2}-\d{8}-\d{1}$/, {
    message: 'El CUIL debe tener un formato válido (ej: 20-12345678-9)',
  })
  cuil: string;

  @IsString()
  @IsOptional()
  puesto?: string;
}
/*Un DTO (Data Transfer Object u Objeto de Transferencia de Datos)
en NestJS es una clase que define cómo viajan los datos por la red.
Sirve para organizar, validar y asegurar la información que el cliente
envía al servidor (o viceversa) */

/*
Un DTO es un objeto que representa los datos que esperás recibir desde afuera.
Por ejemplo, cuando alguien cree un empleado, va a mandar esto:
{
  "nombre": "Ana",
  "apellido": "Gómez",
  "cuil": "27-12345678-9",
  "puesto": "Administrativa"
}
*/
