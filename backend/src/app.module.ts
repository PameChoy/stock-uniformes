import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { CategoriasModule } from './categorias/categorias.module';
import { PrendasModule } from './prendas/prendas.module';
import { VariantesPrendaModule } from './variantes-prenda/variantes-prenda.module';
import { StockModule } from './stock/stock.module';
import { EntregasModule } from './entregas/entregas.module';

@Module({
  imports: [
    PrismaModule,
    EmpleadosModule,
    CategoriasModule,
    PrendasModule,
    VariantesPrendaModule,
    StockModule,
    EntregasModule,
  ],
})
export class AppModule {}
