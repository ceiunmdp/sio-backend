-- Roles
-- SET @administrador = 'Admin';
-- SET @estudiante = 'Estudiante';
-- SET @becado = 'Becado';
-- SET @sede = 'Sede';
-- SET @CATEDRA = 'Catedra';

-- Activate Event Scheduler
-- SET GLOBAL event_scheduler="ON";

-- -- Sedes
-- INSERT INTO `sede` (`id_sede`, `nombre`) VALUES
--     (1, 'Central'),
--     (2, 'Anexo');

-- -- Roles
-- INSERT INTO `rol` (`id_rol`, `nombre`) VALUES
--     (1, 'Admin'),
--     (2, 'Estudiante'),
--     (3, 'Becado'),
--     (4, 'Sede'),
--     (5, 'Catedra');

-- INSERT INTO `usuario`(`id_usuario`, `id_rol`, `email`, `salto`, `contrasena`, `fecha_registro`, `fecha_verificado`, `verificado`, `habilitado`, `tema_dark`, `tipo`) VALUES
--     (1, 1, 'admin@gmail.com', 'salto' , '$2b$10$s0VuWgjcNZv9UAQqk.jEdeUGKWAYn1MjBiBPa7Lx5I.k0kltHk9Ly', '2020-02-23' , '2020-02-23', 1, 1, 1, 1),
--     (2, 2, 'estudiante@gmail.com', 'salto' , '$2b$10$s0VuWgjcNZv9UAQqk.jEdeUGKWAYn1MjBiBPa7Lx5I.k0kltHk9Ly', '2020-02-23' , '2020-02-23', 1, 1, 1, 2),
--     (3, 3, 'becado@gmail.com', 'salto' , '$2b$10$s0VuWgjcNZv9UAQqk.jEdeUGKWAYn1MjBiBPa7Lx5I.k0kltHk9Ly', '2020-02-23' , '2020-02-23', 1, 1, 1, 3),
--     (4, 4, 'central@gmail.com', 'salto' , '$2b$10$s0VuWgjcNZv9UAQqk.jEdeUGKWAYn1MjBiBPa7Lx5I.k0kltHk9Ly', '2020-02-23' , '2020-02-23', 1, 1, 0, 4),
--     (5, 5, 'catedra@gmail.com', 'salto' , '$2b$10$s0VuWgjcNZv9UAQqk.jEdeUGKWAYn1MjBiBPa7Lx5I.k0kltHk9Ly', '2020-02-23' , '2020-02-23', 1, 1, 1, 5);

-- INSERT INTO `usuario_estudiante`(`id_usuario`, `nombre`, `apellido`, `dni`, `saldo`) VALUES
-- 	(2, 'Manuel', 'Nucci', 39966267, 105),
-- 	(3, 'Sebastián', 'Canónaco', 40000000, 180);

-- -- Lista de becados
-- INSERT INTO `lista_becado` (`id_lista_becado`, `dni`, `nombre`, `apellido`, `copias_totales`) VALUES
--     (1, '40000000', 'Sebastián', 'Canónaco', 500),
--     (2, '30000000', 'Emanuel', 'Ponce', 500);

-- INSERT INTO `usuario_becado`(`id_usuario`, `id_lista_becado`, `copias_totales`, `copias_restantes`, `becado_verificado`) VALUES
--     (3, 1, 500, 500, 1);

-- INSERT INTO `usuario_sede`(`id_usuario`, `id_sede`, `nombre`) VALUES
-- 	(4, 1, 'Central');

-- -- Módulos y funcionalidades
-- INSERT INTO `modulo` (`id_modulo`, `nombre`, `id_modulo_padre`) VALUES
--     (1, 'Cuenta', NULL),
--     (2, 'Pedidos', NULL),
--     (3, 'Transferencias', NULL),
--     (4, 'Saldo', NULL);

-- INSERT INTO `funcionalidad` (`id_funcionalidad`, `nombre`, `codigo`, `id_modulo`) VALUES
--     (1, 'Inicio', 'HOME', 1),
--     (2, 'Nuevo pedido', 'NEW_ORDER', 2),
--     (3, 'Mis pedidos', 'MY_ORDERS', 2),
--     (4, 'En curso', 'ACTIVE_ORDERS', 2),
--     (5, 'Histórico', 'HISTORICAL_ORDERS', 2),
--     (6, 'Transferir dinero', 'TRANSFER_MONEY', 3),
--     (7, 'Movimientos', 'MOVEMENTS', 3),
--     (8, 'Listado de estudiantes', 'STUDENT_LIST', 4);

-- -- Relaciones entre funcionalidades y roles
-- INSERT INTO `funcionalidad_rol` (`id_funcionalidad`, `id_rol`) VALUES
--     -- Inicio
--     (1, 1),
--     (1, 2),
--     (1, 3),
--     (1, 4),
--     (1, 5),
--     -- Nuevo pedido
--     (2, 2),
--     (2, 3),
--     -- Mis pedidos
--     (3, 2),
--     (3, 3),
--     -- En curso
--     (4, 4),
--     -- Histórico
--     (5, 4),
--     -- Transferir saldo
--     (6, 2),
--     (6, 3),
--     -- Movimientos
--     (7, 2),
--     (7, 3),
--     -- Listado de estudiantes
--     (8, 4);

-- -- Estados de pedidos
-- INSERT INTO `estado` (`id_estado`, `nombre`) VALUES
--     (1, 'Solicitado'),
--     (2, 'En proceso'),
--     (3, 'Para retirar'),
--     (4, 'Entregado'),
--     (5, 'No entregado'),
--     (6, 'Cancelado');

-- -- Estados de archivos individuales
-- INSERT INTO `pedido_archivo_estado` (`id_estado`, `nombre`) VALUES
--     (1, 'Por imprimir'),
--     (2, 'Impreso');

-- -- Estados de grupos de anillado
-- INSERT INTO `grupo_anillado_estado` (`id_estado`, `nombre`) VALUES
--     (1, 'Por anillar'),
--     (2, 'Anillado');

-- -- Tipos de movimientos
-- INSERT INTO `tipo_movimiento` (`id_tipo_movimiento`, `descripcion`) VALUES
--     (1, 'TRANSFERENCIA ENTRANTE'),
--     (2, 'TRANSFERENCIA SALIENTE'),
--     (3, 'CARGA DE SALDO'),
--     (4, 'PEDIDO');

-- INSERT INTO `careers`(`id`, `name`, `code`) VALUES
--     (1, "Ingeniería Eléctrica", "ELECTRICA"),
--     (2, "Ingeniería Electromecánica", "ELECTROMECANICA"),
--     (3, "Ingeniería Electrónica", "ELECTRONICA"),
--     (4, "Ingeniería en Alimentos", "ALIMENTOS"),
--     (5, "Ingeniería en Materiales", "MATERIALES"),
--     (6, "Ingeniería Industrial", "INDUSTRIAL"),
--     (7, "Ingeniería Mecánica", "MECANICA"),
--     (8, "Ingeniería Química", "QUIMICA"),
--     (9, "Ingeniería en Computación", "COMPUTACION"),
--     (10, "Ingeniería en Informática", "INFORMATICA");

-- INSERT INTO `materia`(`id_materia`, `nombre`, `codigo`) VALUES
--     (1, 'Álgebra A', '631'),
--     (2, 'Análisis Matemático A', '633'),
--     (3, 'Química General I', '1BA'),
--     (4, 'Física 2', '723');

-- INSERT INTO `carrera_materia`(`id_carrera`, `id_materia`, `anio`) VALUES
--     -- Eléctrica
--     (1, 1, 1),
--     (1, 2, 1),
--     (1, 3, 1),
--     (1, 4, 2),
--     -- Electromécanica
--     (2, 1, 1),
--     (2, 2, 1),
--     (2, 3, 1),
--     (2, 4, 2),
--     -- Electrónica
--     (3, 1, 1),
--     (3, 2, 1),
--     (3, 3, 1),
--     (3, 4, 2);

-- INSERT INTO `archivo`(`id_archivo`, `nombre`, `extension`, `cantidad_hojas`, `tipo`) VALUES
--     -- Type = 1 => System file
--     (1, 'Primer parcial', 'pdf', 50, 1),
--     (2, 'Segundo parcial', 'pdf', 10, 1),
--     (3, 'Primer parcial', 'pdf', 18, 1),
--     (4, 'Segundo parcial', 'pdf', 24, 1),
--     (5, 'Primer parcial', 'pdf', 48, 1),
--     (6, 'Segundo parcial', 'pdf', 36, 1),
--     (7, 'Primer parcial', 'pdf', 9, 1),
--     (8, 'Segundo parcial', 'pdf', 13, 1);

-- INSERT INTO `archivo_sistema`(`id_archivo`, `id_materia`) VALUES
--     (1, 1),
--     (2, 1),
--     (3, 2),
--     (4, 2),
--     (5, 3),
--     (6, 3),
--     (7, 4),
--     (8, 4);

-- INSERT INTO `articulo`(`id_articulo`, `nombre`, `codigo`, `precio`, `tipo`) VALUES
--     (1, "Simple faz", "SIMPLE_FAZ", 1, 0),
--     (2, "Doble faz", "DOBLE_FAZ", 1.5, 0),
--     (3, "Fotocopia color", "COLOR", 2, 0),
--     (4, "Anillado pequeño", "ANILLADO_SM", 10, 1),
--     (5, "Anillado mediano", "ANILLADO_MD", 20, 1),
--     (6, "Anillado grande", "ANILLADO_LG", 30, 1);

-- INSERT INTO `anillado`(`id_articulo`, `limite_hojas`) VALUES
--     (4, 40),
--     (5, 80),
--     (6, 120);
