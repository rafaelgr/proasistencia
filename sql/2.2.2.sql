CREATE TABLE `estados_actuacion` (
`estadoActuacionId` INT NOT NULL AUTO_INCREMENT,
`nombre`VARCHAR(255),
PRIMARY KEY (`estadoActuacionId`)
);

INSERT INTO `estados_actuacion` (`nombre`) VALUES ('Ok');
INSERT INTO `estados_actuacion` (`nombre`) VALUES ('Anulada');

CREATE TABLE `estados_presupuesto` (
`estadoPresupuestoId`INT(11) NOT NULL AUTO_INCREMENT,
`nombre`VARCHAR(255),
PRIMARY KEY (`estadoPresupuestoId`)
);

INSERT INTO `estados_presupuesto` (`nombre`) VALUES ('Pendiente de ejecución');
INSERT INTO `estados_presupuesto` (`nombre`) VALUES ('Pendiente de aceptación');
INSERT INTO `estados_presupuesto` (`nombre`) VALUES ('Aceptado');
INSERT INTO `estados_presupuesto` (`nombre`) VALUES ('Rechazado');

CREATE TABLE `rechazos_presupuesto` (
`rechazoPresupuestoId`INT(11) NOT NULL AUTO_INCREMENT,
`nombre`VARCHAR(255),
PRIMARY KEY (`rechazoPresupuestoId`)
);

INSERT INTO `rechazos_presupuesto` (`nombre`) VALUES ('Caro');
INSERT INTO `rechazos_presupuesto` (`nombre`) VALUES ('Otros');

CREATE TABLE `actuaciones`(
`actuacionId`INT(11) NOT NULL AUTO_INCREMENT,
`servicioId`INT(11),
`fechaActuacion`DATE,
`fechaPrevistaCierre`DATE,
`facturaIndividual` BOOL,
`clienteId`INT,
`facturadaCliente` BOOL,
`facturaId`INT,
`proveedorId`INT,
`facturadaProveedor` BOOL,
`facproveId`INT,
`estadoActuacionId`INT(11),
`estadoPresupuestoId`INT(11),
`rechazoPresupuestoId`INT(11),
`notaInterna`TEXT,
`notaAgente`TEXT,
`notaProveedor`TEXT,
PRIMARY KEY (`actuacionId`)

);

ALTER TABLE `actuaciones` 
ADD CONSTRAINT `ref_estados_actuacion` FOREIGN KEY (`estadoActuacionId`) REFERENCES `estados_actuacion`(`estadoActuacionId`);
ALTER TABLE `actuaciones` 
ADD CONSTRAINT `ref_estados_presupuesto` FOREIGN KEY (`estadoPresupuestoId`) REFERENCES `estados_presupuesto`(`estadoPresupuestoId`);

ALTER TABLE `actuaciones` 
ADD CONSTRAINT `ref_rechazos_presupuesto` FOREIGN KEY (`rechazoPresupuestoId`) REFERENCES `rechazos_presupuesto`(`rechazoPresupuestoId`);

 

CREATE TABLE `reparaciones`( 
`reparacionId` INT(11) NOT NULL AUTO_INCREMENT,
`actuacionId` INT(11),
`fechaReparacion` DATE,
`articuloId` INT(11),
`descripcion` VARCHAR(255),
`tarifaClienteId` INT(11),
`tipoIvaCliente` INT(11),
`importeCliente` DECIMAL(12,2),
`tarifaProveedorId` INT(11),
`tipoIvaProveedor` INT(11),
`notasCliente` TEXT,
`notasProveedor` TEXT,
PRIMARY KEY (`reparacionId`),
CONSTRAINT `ref_rep_art` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`articuloId`),
CONSTRAINT `ref_tipoIvaCliente` FOREIGN KEY (`tipoIvaCliente`) REFERENCES `tipos_iva`(`tipoIvaId`),
CONSTRAINT `ref_tipoIvaProveedor` FOREIGN KEY (`tipoIvaProveedor`) REFERENCES `tipos_iva`(`tipoIvaId`),
CONSTRAINT `ref_tarifaCliente` FOREIGN KEY (`tarifaClienteId`) REFERENCES `tarifas_cliente`(`tarifaClienteId`),
CONSTRAINT `ref_tarifaProveedor` FOREIGN KEY (`tarifaProveedorId`) REFERENCES `tarifas_proveedor`(`tarifaProveedorId`)
);

 ALTER TABLE `reparaciones`    ADD COLUMN `importeProveedor` DECIMAL(12,2) NULL AFTER `tipoIvaProveedor`;