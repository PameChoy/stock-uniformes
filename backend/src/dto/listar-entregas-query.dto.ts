import { EstadoEntrega } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class ListarEntregasQueryDto {
  @IsOptional()
  @IsEnum(EstadoEntrega, {
    message: 'El estado debe ser PREPARADA, ENTREGADA o CANCELADA.',
  })
  estado?: EstadoEntrega;
}
