import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CancelarEntregaDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  motivo?: string;
}
