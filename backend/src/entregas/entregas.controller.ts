import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CrearEntregaDto } from '../dto/crear-entrega.dto';
import { EntregasService } from './entregas.service';
import { EntregarDto } from '../dto/entregar.dto';
import { CancelarEntregaDto } from '../dto/cancelar-entrega.dto';
import { RegistrarDevolucionDto } from '../dto/registrar-devolucion.dto';
import { ListarEntregasQueryDto } from '../dto/listar-entregas-query.dto';

//Su función será recibir: POST /entregas
@Controller('entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @Post()
  crearEntrega(@Body() data: CrearEntregaDto) {
    return this.entregasService.crear(data);
  }

  //:entregaId se reemplaza por el UUID
  @Patch(':entregaId/entregar')
  marcarComoEntregada(
    @Param('entregaId', ParseUUIDPipe) entregaId: string,
    @Body() data: EntregarDto,
  ) {
    return this.entregasService.marcarComoEntregada(entregaId, data);
  }

  @Patch(':entregaId/cancelar')
  cancelarEntrega(
    @Param('entregaId', ParseUUIDPipe) entregaId: string,
    @Body() data: CancelarEntregaDto,
  ) {
    return this.entregasService.cancelarEntrega(entregaId, data);
  }

  @Post(':entregaId/devoluciones')
  registrarDevolucion(
    @Param('entregaId', ParseUUIDPipe) entregaId: string,
    @Body() data: RegistrarDevolucionDto,
  ) {
    return this.entregasService.registrarDevolucion(entregaId, data);
  }

  @Get()
  listarEntregas(@Query() filtros: ListarEntregasQueryDto) {
    return this.entregasService.listar(filtros.estado);
  }

  @Patch(':entregaId/firmar-planilla')
  registrarFirma(@Param('entregaId', ParseUUIDPipe) entregaId: string) {
    return this.entregasService.registrarFirmaPlanilla(entregaId);
  }
}

/*
El controller necesitará:
- Llamar a this.entregasService.crear(data).
No necesita @Param ni ParseUUIDPipe, porque los UUID vienen dentro del body y
ya son validados por CrearEntregaDto.
*/
