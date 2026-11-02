import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CrearVariantePrendaDto {
  @IsOptional()
  @IsString({ message: 'El talle debe ser texto.' })
  @Matches(/\S/, { message: 'El talle no puede estar vacío.' })
  talle?: string;

  @IsOptional()
  @IsString({ message: 'El color debe ser texto.' })
  @Matches(/\S/, { message: 'El color no puede estar vacío.' })
  color?: string;

  @IsOptional()
  @IsInt({ message: 'El stock mínimo debe ser un número entero.' })
  @Min(0, { message: 'El stock mínimo no puede ser negativo.' })
  stockMinimo?: number;
}
