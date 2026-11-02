import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCategoriaDto } from '../dto/crear-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: CrearCategoriaDto) {
    try {
      return await this.prisma.categoria.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
      throw error;
    }
  }

  listar() {
    return this.prisma.categoria.findMany({
      where: { activo: true },
      orderBy: [{ nombre: 'asc' }],
    });
  }
}
