//recibir el pedido HTTP y pasárselo al service, no modifica la base de datos por sí mismo.
import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Get,
} from '@nestjs/common';
import { IngresarStockDto } from '../dto/ingresar-stock.dto';
import { StockService } from './stock.service';
//Define el comienzo de la URL. :varianteId es una parte variable: ahí irá el ID
// de la variante a la que querés sumar stock.

@Controller('variantes/:varianteId/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('ingresos') //Indica que el método de abajo atiende pedidos POST terminados en /ingresos
  ingresar(
    @Param('varianteId', ParseUUIDPipe) varianteId: string, //toma el ID de la URL. ParseUUIDPipe comprueba su formato
    @Body() data: IngresarStockDto, //toma el JSON del pedido
  ) {
    return this.stockService.ingresar(varianteId, data);
    /*Le entrega ambos datos al service y devuelve su resultado como respuesta HTTP.
        El recorrido completo es: Thunder Client → controller → service → Prisma → base de datos → respuesta. */
  }

  @Get('movimientos')
  listarMovimientos(@Param('varianteId', ParseUUIDPipe) varianteId: string) {
    return this.stockService.listarMovimientos(varianteId);
  }
}
