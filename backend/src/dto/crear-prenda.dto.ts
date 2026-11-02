import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CrearPrendaDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre de la prenda es obligatorio.' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto.' })
  descripcion?: string;

  @IsNotEmpty({ message: 'La categoría es obligatoria.' })
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido.' })
  categoriaId: string;
}
