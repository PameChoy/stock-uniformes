import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrearPrendaDto } from '../dto/crear-prenda.dto';
import { PrendasService } from './prendas.service';

@Controller('prendas')
export class PrendasController {
  constructor(private readonly prendasService: PrendasService) {}

  @Post()
  crear(@Body() data: CrearPrendaDto) {
    return this.prendasService.crear(data);
  }

  @Get()
  listar() {
    return this.prendasService.listar();
  }
}
