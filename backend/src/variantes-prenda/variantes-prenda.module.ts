import { Module } from '@nestjs/common';
import { VariantesPrendaService } from './variantes-prenda.service';
import { VariantesPrendaController } from './variantes-prenda.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VariantesPrendaService],
  controllers: [VariantesPrendaController],
})
export class VariantesPrendaModule {}
