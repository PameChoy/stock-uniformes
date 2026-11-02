import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class IngresarStockDto {
  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser mayor que cero.' })
  cantidad: number;

  @IsOptional()
  @IsString({ message: 'El motivo debe ser texto.' })
  motivo?: string;
}
