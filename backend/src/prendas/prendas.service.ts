import { Injectable, NotFoundException } from '@nestjs/common';
import { CrearPrendaDto } from '../dto/crear-prenda.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrendasService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: CrearPrendaDto) {
    const categoria = await this.prisma.categoria.findFirst({
      where: { id: data.categoriaId, activo: true },
      select: { id: true },
    });

    if (!categoria) {
      throw new NotFoundException('La categoría no existe o está inactiva.');
    }

    return this.prisma.prenda.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        categoria: { connect: { id: categoria.id } },
      },
      include: {
        categoria: { select: { id: true, nombre: true } },
      },
    });
  }

  listar() {
    return this.prisma.prenda.findMany({
      where: { activo: true },
      include: {
        categoria: { select: { id: true, nombre: true } },
      },
      orderBy: { nombre: 'asc' },
    });
  }
}
