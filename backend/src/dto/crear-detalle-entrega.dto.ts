/* CrearDetalleEntregaDto validará cada renglón:
variantePrendaId → UUID obligatorio
cantidad         → entero mayor que cero*/
import { IsInt, IsNotEmpty, Min, IsUUID } from 'class-validator';

export class CrearDetalleEntregaDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'El ID de la variante debe ser un UUID válido.' })
  variantePrendaId: string;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0.' })
  cantidad: number;
}
