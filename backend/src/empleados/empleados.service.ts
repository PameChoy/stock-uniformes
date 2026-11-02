//Contiene la lógica para crear y listar empleados.
//Usa Prisma para consultar la base de datos y responde con un error 409 si el CUIL ya existe.
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearEmpleadoDto } from '../dto/crear-empleado.dto';

@Injectable()
export class EmpleadosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: CrearEmpleadoDto) {
    try {
      return await this.prisma.empleado.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' //es el código de Prisma para una restricción única duplicada
      ) {
        throw new ConflictException('Ya existe un empleado con ese CUIL');
      }
      throw error;
    }
  }

  //Trae todos los empleados ordenados por nomrbe y apellido
  listar() {
    return this.prisma.empleado.findMany({
      orderBy: [{ nombre: 'asc' }, { apellido: 'asc' }],
    });
  }

  async historialEntregas(empleadoId: string) {
    const empleado = await this.buscarEmpleadoPorId(empleadoId);

    const entregas = await this.prisma.entrega.findMany({
      where: { empleadoId: empleado.id }, //Busca las entregas donde Entrega.empleadoId sea igual al id del empleado encontrado
      orderBy: { fechaPreparacion: 'desc' },
      select: {
        id: true,
        fechaPreparacion: true,
        estado: true,
        fechaEntrega: true,
        planillaFirmada: true,
        fechaFirmaPlanilla: true,
        observacion: true,
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
                  select: { id: true, nombre: true },
                },
              },
            },
            movimientosStock: {
              where: {
                tipo: 'DEVOLUCION',
              },
              select: {
                id: true,
                motivo: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    const historial = entregas.flatMap((entrega) =>
      entrega.detalles.map((detalle) => {
        const devolucion = detalle.movimientosStock[0];
        let estadoVisual: 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO' | 'DEVUELTO';

        if (entrega.estado === 'PREPARADA') {
          estadoVisual = 'PENDIENTE';
        } else if (entrega.estado === 'CANCELADA') {
          estadoVisual = 'CANCELADO';
        } else if (devolucion) {
          estadoVisual = 'DEVUELTO';
        } else {
          estadoVisual = 'ENTREGADO';
        }

        return {
          entregaId: entrega.id,
          detalleEntregaId: detalle.id,
          variantePrendaId: detalle.variantePrenda.id,
          fecha: entrega.fechaEntrega ?? entrega.fechaPreparacion,
          prenda: detalle.variantePrenda.prenda,
          talle: detalle.variantePrenda.talle,
          color: detalle.variantePrenda.color,
          cantidad: detalle.cantidad,
          estadoVisual,
          motivoDevolucion: devolucion?.motivo ?? null,
        };
      }),
    );

    return {
      empleado,
      historial,
    };
  }

  private async buscarEmpleadoPorId(empleadoId: string) {
    const empleado = await this.prisma.empleado.findUnique({
      where: { id: empleadoId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cuil: true,
        puesto: true,
        activo: true,
      },
    });

    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return empleado;
  }
}

/*
Service: Contiene la lógica de la funcionalidad.
 */
