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



DROP TABLE tarifas_lineas;

DROP TABLE tarifas;

DROP TABLE grupo_tarifa;

/*ARTICULOS*/
INSERT INTO grupo_articulo (grupoArticuloId, nombre) VALUES(69, 'REPARACIONES');

INSERT INTO articulos (codigoReparacion, nombre, grupoArticuloId) 
SELECT CONCAT('0',codReparacion) AS codigoReparacion, descripcion AS nombre, 69 AS grupoArticuloId  
FROM temp_articulos

