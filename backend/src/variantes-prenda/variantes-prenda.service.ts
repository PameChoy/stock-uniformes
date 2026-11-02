import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CrearVariantePrendaDto } from '../dto/crear-variante-prenda.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VariantesPrendaService {
  constructor(private readonly prisma: PrismaService) {}

  private async verificarPrendaActiva(prendaId: string) {
    const prenda = await this.prisma.prenda.findFirst({
      where: { id: prendaId, activo: true },
      select: { id: true },
    });

    if (!prenda) {
      throw new NotFoundException('La prenda no existe o está inactiva.');
    }
  }

  async crear(prendaId: string, data: CrearVariantePrendaDto) {
    await this.verificarPrendaActiva(prendaId);

    const talle = data.talle?.trim() || null;
    const color = data.color?.trim() || null;
    const existente = await this.prisma.variantePrenda.findFirst({
      where: { prendaId, talle, color },
      select: { id: true },
    });

    if (existente) {
      throw new ConflictException(
        'Ya existe una variante con ese talle y color para esta prenda.',
      );
    }

    try {
      return await this.prisma.variantePrenda.create({
        data: {
          talle,
          color,
          stockMinimo: data.stockMinimo ?? 0,
          prenda: { connect: { id: prendaId } },
        },
        include: {
          prenda: { select: { id: true, nombre: true } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Ya existe una variante con ese talle y color para esta prenda.',
          );
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('La prenda no existe o está inactiva.');
        }
      }
      throw error;
    }
  }

  async listar(prendaId: string) {
    await this.verificarPrendaActiva(prendaId);

    return this.prisma.variantePrenda.findMany({
      where: { prendaId, activo: true },
      include: {
        prenda: { select: { id: true, nombre: true } },
      },
      orderBy: [{ talle: 'asc' }, { color: 'asc' }],
    });
  }
}
