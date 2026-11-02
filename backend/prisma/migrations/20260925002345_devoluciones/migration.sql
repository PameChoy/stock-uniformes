-- AlterEnum
ALTER TYPE "TipoMovimientoStock" ADD VALUE 'DEVOLUCION';

-- DropIndex
DROP INDEX "MovimientoStock_detalleEntregaId_key";
