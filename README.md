# Sistema de stock de uniformes

Aplicación web full-stack para gestionar empleados, categorías, prendas, variantes, movimientos de stock y entregas de uniformes.

## Estructura

- `backend`: API REST desarrollada con NestJS, TypeScript, Prisma y PostgreSQL alojado en Supabase.
- `frontend`: interfaz desarrollada con React, TypeScript y Vite.

## Requisitos

- Node.js y npm.
- Una base de datos PostgreSQL accesible mediante una URL de conexión.

## Configurar el backend

1. Entrar en `backend`.
2. Ejecutar `npm install`.
3. Copiar `.env.example` como `.env`.
4. Completar `DATABASE_URL` con la conexión de PostgreSQL/Supabase.
5. Ejecutar `npx prisma generate`.
6. Ejecutar `npx prisma migrate deploy` si la base de datos todavía no tiene las migraciones.
7. Iniciar con `npm run start:dev`.

El backend queda disponible en `http://localhost:3000`.

## Configurar el frontend

1. Entrar en `frontend`.
2. Ejecutar `npm install`.
3. Iniciar con `npm run dev`.

El frontend utiliza actualmente la API local configurada en `src/config/api.ts`.

## Seguridad

Los archivos `.env` están excluidos del repositorio. Nunca se deben subir contraseñas, claves ni cadenas de conexión reales.
