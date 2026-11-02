import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CrearCategoriaDto } from '../dto/crear-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  crear(@Body() data: CrearCategoriaDto) {
    return this.categoriasService.crear(data);
  }

  @Get()
  listar() {
    return this.categoriasService.listar();
  }
}
