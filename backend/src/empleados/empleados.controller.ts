//Define las rutas POST /empleados y GET /empleados. Recibe el pedido y llama al service
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CrearEmpleadoDto } from '../dto/crear-empleado.dto';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  crear(@Body() data: CrearEmpleadoDto) {
    return this.empleadosService.crear(data);
  }

  @Get()
  listar() {
    return this.empleadosService.listar();
  }

  @Get(':empleadoId/entregas') //los : indican que esa parte de la ruta es variable
  historialEntregas(@Param('empleadoId', ParseUUIDPipe) empleadoId: string) {
    //valido que sea UUID con ParseUUIDPipe
    return this.empleadosService.historialEntregas(empleadoId);
  }
}

/*Controller: Recibe las solicitudes HTTP del frontend y devuelve la respuesta.
Por ejemplo: Atiende POST /categorias, toma el nombre enviado y llama al service.
*/
