import { IsBoolean, IsOptional } from 'class-validator';

export class EntregarDto {
  @IsOptional()
  @IsBoolean()
  planillaFirmada?: boolean;
}
