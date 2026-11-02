import { Module } from '@nestjs/common';
import { PrendasService } from './prendas.service';
import { PrendasController } from './prendas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PrendasService],
  controllers: [PrendasController],
})
export class PrendasModule {}
