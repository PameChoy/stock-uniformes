/*
  Warnings:

  - You are about to drop the column `createdAt` on the `DetalleEntrega` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `DetalleEntrega` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Entrega` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Entrega` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Entrega` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `MovimientoStock` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MovimientoStock` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('PREPARADA', 'ENTREGADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "DetalleEntrega" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- Conservar la fecha existente cambiando únicamente su nombre
ALTER TABLE "Entrega"
RENAME COLUMN "fecha" TO "fechaPreparacion";

-- Incorporar el estado y la fecha real de entrega
ALTER TABLE "Entrega"
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN "estado" "EstadoEntrega" NOT NULL DEFAULT 'PREPARADA',
ADD COLUMN "fechaEntrega" TIMESTAMP(3);

-- Las entregas creadas antes de esta funcionalidad ya fueron realizadas
UPDATE "Entrega"
SET
  "estado" = 'ENTREGADA',
  "fechaEntrega" = "fechaPreparacion";

-- AlterTable
ALTER TABLE "MovimientoStock" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
