import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CrearVariantePrendaDto } from '../dto/crear-variante-prenda.dto';
import { VariantesPrendaService } from './variantes-prenda.service';

@Controller('prendas/:prendaId/variantes')
export class VariantesPrendaController {
  constructor(
    private readonly variantesPrendaService: VariantesPrendaService,
  ) {}

  @Post()
  crear(
    @Param('prendaId', ParseUUIDPipe) prendaId: string,
    @Body() data: CrearVariantePrendaDto,
  ) {
    return this.variantesPrendaService.crear(prendaId, data);
  }

  @Get()
  listar(@Param('prendaId', ParseUUIDPipe) prendaId: string) {
    return this.variantesPrendaService.listar(prendaId);
  }
}
