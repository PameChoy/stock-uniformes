-- CreateEnum
CREATE TYPE "TipoMovimientoStock" AS ENUM ('INGRESO', 'EGRESO', 'AJUSTE');

-- CreateTable
CREATE TABLE "Empleado" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cuil" TEXT NOT NULL,
    "puesto" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prenda" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoriaId" UUID NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Prenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantePrenda" (
    "id" UUID NOT NULL,
    "prendaId" UUID NOT NULL,
    "talle" TEXT,
    "color" TEXT,
    "stockActual" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VariantePrenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" UUID NOT NULL,
    "empleadoId" UUID NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planillaFirmada" BOOLEAN NOT NULL DEFAULT false,
    "fechaFirmaPlanilla" TIMESTAMP(3),
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleEntrega" (
    "id" UUID NOT NULL,
    "entregaId" UUID NOT NULL,
    "variantePrendaId" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetalleEntrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoStock" (
    "id" UUID NOT NULL,
    "variantePrendaId" UUID NOT NULL,
    "tipo" "TipoMovimientoStock" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,
    "detalleEntregaId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovimientoStock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_cuil_key" ON "Empleado"("cuil");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "VariantePrenda_prendaId_talle_color_key" ON "VariantePrenda"("prendaId", "talle", "color");

-- CreateIndex
CREATE UNIQUE INDEX "MovimientoStock_detalleEntregaId_key" ON "MovimientoStock"("detalleEntregaId");

-- AddForeignKey
ALTER TABLE "Prenda" ADD CONSTRAINT "Prenda_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantePrenda" ADD CONSTRAINT "VariantePrenda_prendaId_fkey" FOREIGN KEY ("prendaId") REFERENCES "Prenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleEntrega" ADD CONSTRAINT "DetalleEntrega_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "Entrega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleEntrega" ADD CONSTRAINT "DetalleEntrega_variantePrendaId_fkey" FOREIGN KEY ("variantePrendaId") REFERENCES "VariantePrenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoStock" ADD CONSTRAINT "MovimientoStock_variantePrendaId_fkey" FOREIGN KEY ("variantePrendaId") REFERENCES "VariantePrenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoStock" ADD CONSTRAINT "MovimientoStock_detalleEntregaId_fkey" FOREIGN KEY ("detalleEntregaId") REFERENCES "DetalleEntrega"("id") ON DELETE SET NULL ON UPDATE CASCADE;
