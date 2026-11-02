//ingresar unidades al stock y dejar constancia de por qué cambió
import { Injectable, NotFoundException } from '@nestjs/common';
import { TipoMovimientoStock } from '@prisma/client';
import { IngresarStockDto } from '../dto/ingresar-stock.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}
  //Recibe los datos. varianteId identifica la variante concreta, por ejemplo “zapato talle 39”.
  // data contiene la cantidad y, opcionalmente, el motivo
  ingresar(varianteId: string, data: IngresarStockDto) {
    return this.prisma.$transaction(async (tx) => {
      //tx es el acceso a la base de datos que comparten todas las operaciones de este ingreso
      const variante = await tx.variantePrenda.findFirst({
        where: {
          id: varianteId,
          activo: true,
          prenda: { is: { activo: true } },
        },
        select: { id: true },
      });

      if (!variante) {
        throw new NotFoundException('La variante no existe o está inactiva.');
      }

      const actualizada = await tx.variantePrenda.update({
        where: { id: varianteId },
        //Suma la cantidad a stockActual mediante increment.
        // Por ejemplo, si había 3 unidades e ingresás 5, queda en 8. No reemplaza el valor anterior por 5.
        data: { stockActual: { increment: data.cantidad } },
        select: { stockActual: true },
      });

      const movimiento = await tx.movimientoStock.create({
        //Crea un MovimientoStock de tipo INGRESO
        data: {
          variantePrenda: { connect: { id: varianteId } },
          tipo: TipoMovimientoStock.INGRESO,
          cantidad: data.cantidad,
          motivo: data.motivo?.trim() || null,
        },
      });

      return { movimiento, stockActual: actualizada.stockActual };
      //Devuelve el movimiento creado y el nuevo stockActual para que el controller pueda enviarlos como respuesta.
    });
  }

  async listarMovimientos(varianteId: string) {
    const variante = await this.prisma.variantePrenda.findFirst({
      where: {
        id: varianteId,
        activo: true,
        prenda: { is: { activo: true } },
      },
      select: { id: true },
    });

    if (!variante) {
      throw new NotFoundException('La variante no existe o está inactiva.');
    }

    return this.prisma.movimientoStock.findMany({
      where: { variantePrendaId: varianteId },
      orderBy: { fecha: 'desc' },
    });
  }
}
