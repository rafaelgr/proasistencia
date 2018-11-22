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

ALTER TABLE `tarifas_cliente_lineas`   
  ADD  UNIQUE INDEX `tarifa_cliente_articulo` (`tarifaClienteId`, `articuloId`);


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

ALTER TABLE `tarifas_proveedor_lineas`   
  ADD  UNIQUE INDEX `tarifaProveedor_articulo_unique` (`tarifaProveedorId`, `articuloId`);


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




