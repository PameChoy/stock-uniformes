import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CrearEntregaDto } from '../dto/crear-entrega.dto';
import { EntregarDto } from '../dto/entregar.dto';
import { CancelarEntregaDto } from '../dto/cancelar-entrega.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrarDevolucionDto } from '../dto/registrar-devolucion.dto';
import { EstadoEntrega } from '@prisma/client';

@Injectable()
export class EntregasService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(estado?: EstadoEntrega) {
    const entregas = await this.prisma.entrega.findMany({
      where: estado ? { estado: estado } : undefined,
      select: {
        id: true,
        estado: true,
        fechaEntrega: true,
        fechaPreparacion: true,
        observacion: true,
        planillaFirmada: true,
        fechaFirmaPlanilla: true,
        empleado: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
        detalles: {
          select: {
            id: true,
            cantidad: true,
            variantePrenda: {
              select: {
                id: true,
                talle: true,
                color: true,
                prenda: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        fechaPreparacion: 'desc',
      },
    });

    return entregas;
  }

  async crear(data: CrearEntregaDto) {
    //comprueba si la misma variante aparece más de una vez en una entrega
    const ids = data.detalles.map((detalle) => detalle.variantePrendaId); //guardo los UUID de las variantes en el nuevo array
    const hayRepetidas = new Set(ids).size !== ids.length; //comparo el array con el Set

    if (hayRepetidas) {
      throw new BadRequestException(
        'No se puede incluir la misma variante más de una vez.',
      );
    }

    const empleado = await this.prisma.empleado.findFirst({
      where: { id: data.empleadoId, activo: true },
      select: { id: true },
    });

    if (!empleado) {
      throw new NotFoundException('El empleado no existe o está inactivo.');
    }

    const variantes = await this.obtenerVariantesActivas(ids);

    for (const detalle of data.detalles) {
      //recorre cada item/renglon de la entrega a realizar
      const variante = variantes.find(
        (item) => item.id === detalle.variantePrendaId, //busca dentro de las variantes obtenidas de PostgreSQL aquella cuyo id coincide con el solicitado
      )!;
      //para después poder comparar la cantidad requerida contra la cantidad en stock
      if (variante.stockActual < detalle.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${variante.prenda.nombre}. Disponible: ${variante.stockActual}, solicitado: ${detalle.cantidad}.`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const entrega = await tx.entrega.create({
        data: {
          //crea la cabecera de la entrega con el empleado y la observación
          empleadoId: data.empleadoId,
          observacion: data.observacion,
        },
      });
      //dentro de esta misma transacción, recorreremos data.detalles para crear los DetalleEntrega por cada variantePrenda
      for (const detalle of data.detalles) {
        //recorro las variantes solicitadas
        const detalleCreado = await tx.detalleEntrega.create({
          //Crea una fila de DetalleEntrega
          data: {
            entregaId: entrega.id,
            variantePrendaId: detalle.variantePrendaId,
            cantidad: detalle.cantidad,
          },
        });

        //descontar stock                                updateMany actualiza las filas que cumplan todas las condiciones
        const stockActualizado = await tx.variantePrenda.updateMany({
          where: {
            //define las condiciones que debe cumplir la variante para ser actualizada
            id: detalle.variantePrendaId,
            activo: true,
            stockActual: {
              //Selecciona la variante solamente si su stockActual es mayor o igual que detalle.cantidad
              //la cantidad disponible debe ser mayor o igual que la solicitada
              gte: detalle.cantidad, //gte significa mayor o igual que (greater than or equal)
            },
          },
          data: {
            //data indica qué cambio se realizará si la variante cumple las condiciones del where
            stockActual: {
              decrement: detalle.cantidad, //Resta la cantidad solicitada al stock actual
            }, //decrement hace la resta directamente en PostgreSQL. No se necesita calcular manualmente
          },
        });

        if (stockActualizado.count !== 1) {
          throw new BadRequestException(
            'El stock disponible cambió o ya no es suficiente.',
          );
        } //prisma revierte todo si se llega a este punto

        //cada detalleEntrega tiene su movimientoStock EGRESO
        await tx.movimientoStock.create({
          data: {
            variantePrendaId: detalle.variantePrendaId,
            tipo: 'EGRESO',
            cantidad: detalle.cantidad,
            motivo: 'Preparación de entrega',
            detalleEntregaId: detalleCreado.id,
          },
        });
      }

      return {
        mensaje: 'Entrega preparada correctamente.',
        entregaId: entrega.id,
      };
    });
  }

  private async obtenerVariantesActivas(ids: string[]) {
    //buscar todas las variantes solicitadas
    const variantes = await this.prisma.variantePrenda.findMany({
      where: {
        id: { in: ids },
        activo: true,
        prenda: {
          is: { activo: true },
        },
      },
      select: {
        id: true,
        stockActual: true,
        talle: true,
        color: true,
        prenda: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (variantes.length !== ids.length) {
      throw new NotFoundException(
        'Una o más variantes no existen o están inactivas.',
      );
    }

    return variantes;
  }

  async marcarComoEntregada(entregaId: string, data: EntregarDto) {
    const entrega = await this.buscarEntrega(entregaId);

    if (entrega.estado === 'ENTREGADA') {
      throw new ConflictException('Ya fue entregado');
    }

    if (entrega.estado === 'CANCELADA') {
      throw new ConflictException('Esta entrega fue cancelada');
    }

    const planillaFirmada = data.planillaFirmada ?? false;
    const fechaActual = new Date();

    const entregaActualizada = await this.prisma.entrega.update({
      where: {
        id: entregaId,
      },
      data: {
        planillaFirmada: planillaFirmada,
        fechaFirmaPlanilla: planillaFirmada ? fechaActual : null,
        estado: 'ENTREGADA',
        fechaEntrega: fechaActual,
      },
    });

    return entregaActualizada;
  }

  async cancelarEntrega(entregaId: string, data: CancelarEntregaDto) {
    const entrega = await this.buscarEntrega(entregaId);

    if (entrega.estado === 'ENTREGADA') {
      throw new ConflictException(
        'No se puede cancelar: corresponde registrar una devolución.',
      );
    }
    if (entrega.estado === 'CANCELADA') {
      throw new ConflictException('Esta entrega ya fue cancelada');
    }

    const detalles = await this.buscarDetalles(entregaId);
    const motivoIngresado = data.motivo?.trim();
    const motivoMovimiento = motivoIngresado
      ? `Cancelación de entrega preparada: ${motivoIngresado}`
      : 'Cancelación de entrega preparada';

    return this.prisma.$transaction(async (tx) => {
      const entregaCancelada = await tx.entrega.update({
        where: { id: entregaId },
        data: {
          estado: 'CANCELADA',
        },
      });

      for (const detalle of detalles) {
        await tx.variantePrenda.update({
          where: {
            id: detalle.variantePrendaId,
          },
          data: {
            stockActual: {
              increment: detalle.cantidad,
            },
          },
        });

        await tx.movimientoStock.create({
          data: {
            variantePrendaId: detalle.variantePrendaId,
            tipo: 'INGRESO',
            cantidad: detalle.cantidad,
            motivo: motivoMovimiento,
            detalleEntregaId: detalle.id,
          },
        });
      }

      return {
        mensaje: 'Entrega cancelada correctamente.',
        entregaId: entregaCancelada.id,
        estado: entregaCancelada.estado,
      };
    });
  }

  async registrarDevolucion(entregaId: string, data: RegistrarDevolucionDto) {
    const entrega = await this.buscarEntrega(entregaId);

    if (entrega.estado !== 'ENTREGADA') {
      throw new ConflictException(
        'Solo se pueden registrar devoluciones de entregas que sí se completaron.',
      );
    }

    const detalles = await this.buscarDetalles(entregaId);
    const detalle = detalles.find((detalle) => {
      return detalle.id === data.detalleEntregaId;
    });

    if (!detalle) {
      throw new NotFoundException(
        'El detalle indicado no pertenece a esta entrega.',
      );
    }

    if (data.cantidad !== detalle.cantidad) {
      throw new BadRequestException(
        `La devolución debe incluir las ${detalle.cantidad} unidades del detalle. No se permiten devoluciones parciales.`,
      );
    }

    const devolucionExistente = await this.prisma.movimientoStock.findFirst({
      where: {
        detalleEntregaId: detalle.id,
        tipo: 'DEVOLUCION',
      },
      select: {
        id: true,
      },
    });

    if (devolucionExistente) {
      throw new ConflictException('Este detalle de entrega ya fue devuelto.');
    }

    return this.ejecutarDevolucion(entregaId, detalle, data);
  }

  private async ejecutarDevolucion(
    entregaId: string,
    detalle: { id: string; variantePrendaId: string },
    data: RegistrarDevolucionDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const varianteActualizada = await tx.variantePrenda.update({
        where: {
          id: detalle.variantePrendaId,
        },
        data: {
          stockActual: {
            increment: data.cantidad,
          },
        },
        select: {
          id: true,
          stockActual: true,
        },
      });

      const movimiento = await tx.movimientoStock.create({
        data: {
          variantePrendaId: detalle.variantePrendaId,
          detalleEntregaId: detalle.id,
          tipo: 'DEVOLUCION',
          cantidad: data.cantidad,
          motivo: data.motivo.trim(),
        },
      });

      return {
        mensaje: 'Devolución registrada correctamente.',
        entregaId,
        movimientoId: movimiento.id,
        stockActual: varianteActualizada.stockActual,
      };
    });
  }

  private async buscarEntrega(entregaId: string) {
    const entrega = await this.prisma.entrega.findUnique({
      where: {
        id: entregaId,
      },
      select: {
        id: true,
        estado: true,
        fechaEntrega: true,
      },
    });

    if (!entrega) {
      throw new NotFoundException('La entrega solicitada no existe');
    }

    return entrega;
  }

  private async buscarDetalles(entregaId: string) {
    const detalles = await this.prisma.detalleEntrega.findMany({
      where: { entregaId },
      select: {
        id: true,
        variantePrendaId: true,
        cantidad: true,
      },
    });

    return detalles;
  }
}
