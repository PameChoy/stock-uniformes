import {
  IsString,
  IsInt,
  IsUUID,
  Min,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class RegistrarDevolucionDto {
  @IsUUID('4', { message: 'El ID debe ser un UUID válido.' })
  @IsNotEmpty()
  detalleEntregaId: string;

  @IsInt({})
  @Min(1, { message: 'La cantidad debe ser mayor a 0.' })
  cantidad: number;

  @IsString({})
  @IsNotEmpty()
  @Matches(/\S/, { message: 'El motivo no puede estar vacío.' })
  motivo: string;
}
