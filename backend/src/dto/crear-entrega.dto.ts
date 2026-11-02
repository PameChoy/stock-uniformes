/*CrearEntregaDto validará la operación completa:
empleadoId  → UUID obligatorio
observacion → texto opcional
detalles    → array obligatorio con al menos un elemento */
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CrearDetalleEntregaDto } from './crear-detalle-entrega.dto';

export class CrearEntregaDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'El ID del empleado debe ser un UUID válido.' })
  empleadoId: string;

  @IsString()
  @IsOptional()
  observacion?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'La entrega debe incluir al menos una prenda.' })
  @ValidateNested({ each: true })
  @Type(() => CrearDetalleEntregaDto)
  detalles: CrearDetalleEntregaDto[];
}
