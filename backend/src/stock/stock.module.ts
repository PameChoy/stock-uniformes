//es la pieza que conecta los archivos de Stock dentro de NestJS
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

@Module({
  imports: [PrismaModule],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}

//StockModule reúne controller + service y le da al service acceso a PrismaModule.
//El DTO no va en esta lista: el controller lo usa directamente como tipo y para validar el body.
