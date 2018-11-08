CREATE TABLE `tarifas_cliente` ( 
`tarifaClienteId` INT(11) NOT NULL AUTO_INCREMENT,
`nombre` VARCHAR(255),
PRIMARY KEY (`tarifaClienteId`)
);

CREATE TABLE `tarifas_cliente_lineas` ( 
`tarifaClienteLineaId` INT(11) NOT NULL AUTO_INCREMENT,
`tarifaClienteId` INT(11),
`articuloId` INT(11),
`precioUnitario` DECIMAL(12,2),
PRIMARY KEY (`tarifaClienteLineaId`),
CONSTRAINT `ref_tarifa_cliente` FOREIGN KEY (`tarifaClienteId`) REFERENCES `proasistencia`.`tarifas_cliente`(`tarifaClienteId`),
CONSTRAINT `ref_tarifa_cliente_articulo` FOREIGN KEY (`articuloId`) REFERENCES `proasistencia`.`articulos`(`articuloId`)
);

CREATE TABLE `tarifas_proveedor` ( 
`tarifaProveedorId` INT(11) NOT NULL AUTO_INCREMENT,
`nombre` VARCHAR(255),
PRIMARY KEY (`tarifaProveedorId`)
);

CREATE TABLE `tarifas_proveedor_lineas` ( 
`tarifaProveedorLineaId` INT(11) NOT NULL AUTO_INCREMENT,
`tarifaProveedorId` INT(11),
`articuloId` INT(11),
`precioUnitario` DECIMAL(12,2),
PRIMARY KEY (`tarifaProveedorLineaId`),
CONSTRAINT `ref_tarifa_proveedor` FOREIGN KEY (`tarifaProveedorId`) REFERENCES `proasistencia`.`tarifas_proveedor`(`tarifaProveedorId`),
CONSTRAINT `ref_tarifa_proveedor_articulo` FOREIGN KEY (`articuloId`) REFERENCES `proasistencia`.`articulos`(`articuloId`)
);

UPDATE clientes SET tarifaId = NULL;

UPDATE proveedores SET tarifaId = NULL;

ALTER TABLE `clientes` DROP FOREIGN KEY `fkey_tarifa_cliente`;

ALTER TABLE `clientes` ADD CONSTRAINT `fkey_tarifa_cliente` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas_cliente`(`tarifaClienteId`) ON UPDATE CASCADE ON DELETE NO ACTION;

ALTER TABLE `proveedores` DROP FOREIGN KEY `proveedores_tarifa`;

ALTER TABLE `proveedores` ADD CONSTRAINT `proveedores_tarifa` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas_proveedor`(`tarifaProveedorId`) ON UPDATE CASCADE ON DELETE NO ACTION;

ALTER TABLE  `servicios`   
  ADD COLUMN `notasPrivadas` TEXT NULL AFTER `descripcion`;

  ALTER TABLE `articulos`   
  ADD COLUMN `codigoReparacion` VARCHAR(255) NULL AFTER `descripcion`;


CREATE TABLE `locales_afectados` ( 
`localAfectadoId` INT(11) NOT NULL AUTO_INCREMENT,
`servicioId` INT(11),
`local` VARCHAR(255),
`personaContacto` VARCHAR(255),
`telefono1` VARCHAR(255),
`telefono2` VARCHAR(255),
`correoElectronico` VARCHAR(255),
`deHoraAtencion` VARCHAR(255),
`aHoraAtencion` VARCHAR(255),
`deHoraAtencion2` VARCHAR(255),
`aHoraAtencion2` VARCHAR(255),
`deDiaSemana` VARCHAR(255),
`aDiaSemana` VARCHAR(255),
`comentarios` TEXT,
PRIMARY KEY (`localAfectadoId`),
CONSTRAINT `ref_locales_servicios` FOREIGN KEY (`servicioId`) REFERENCES `proasistencia`.`servicios`(`servicioId`) ON DELETE CASCADE
);

ALTER TABLE `locales_afectados` 
ADD COLUMN `cargo` VARCHAR(255) NULL AFTER `comentarios`;



/*-------------------------------IMPORTACIONES DE TARIFAS Y ARTICULOS NUEVOS-----------------------------------------*/

/*DROP TABLE tarifas_lineas;*/

/*DROP TABLE tarifas;*/

/*DROP TABLE grupo_tarifa;*/


/*ARTICULOS*/
/*INSERT INTO grupo_articulo (grupoArticuloId, nombre) VALUES(69, 'REPARACIONES');*/

/*En este punto hay que ejecutar tmp_articulos_cli.sql y tmp_articulos_pro.sql*/

/*INSERT INTO articulos (codigoReparacion, nombre, precioUnitario,grupoArticuloId, unidadId) 
SELECT CONCAT('0',codReparacion) AS codigoReparacion, descripcion AS nombre, 0.00 AS precioUnitario,69 AS grupoArticuloId, 9 AS unidadId
FROM temp_articulos;*/

/*TARIFAS*/
/*INSERT INTO tarifas_cliente (tarifaClienteId, nombre) VALUES(1, 'Cliente tarifa 1');
INSERT INTO tarifas_Proveedor (tarifaProveedorId, nombre) VALUES(1, 'Profesional tarifa 6');

INSERT INTO tarifas_cliente_lineas (`tarifaClienteId`,`articuloId`,`precioUnitario`) 
SELECT 1 AS tarifaClienteId,ar.articuloId AS articuliId, tem.cliente_tarifa_1 AS precioUnitario FROM articulos AS ar
LEFT JOIN temp_articulos AS tem ON (SELECT CONCAT('0',tem.codReparacion)) = ar.codigoReparacion 
WHERE tem.codReparacion IS NOT NULL;

INSERT INTO tarifas_proveedor_lineas (`tarifaProveedorId`,`articuloId`,`precioUnitario`) 
SELECT 1 AS tarifaProveedorId,ar.articuloId AS articuloId, tem.ProfTarifa_6 AS precioUnitario FROM articulos AS ar
LEFT JOIN tmp_articulos_prof AS tem ON (SELECT CONCAT('0',tem.codReparacion)) = ar.codigoReparacion 
WHERE tem.codReparacion IS NOT NULL;*/