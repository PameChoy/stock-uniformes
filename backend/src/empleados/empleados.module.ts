//Conecta el controller, el service y PrismaModule para que NestJS pueda usarlos juntos.
import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmpleadosService],
  controllers: [EmpleadosController],
})
export class EmpleadosModule {}
/*
Module: Conecta las piezas de esa funcionalidad.
Declara el controller y el service, e importa el PrismaModule para poder usar prisma
*/
