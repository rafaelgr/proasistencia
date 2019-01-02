CREATE TABLE `proasistencia`.`estados_actuacion` (
  `estadoActuacionId` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`estadoActuacionId`)
);

INSERT INTO `proasistencia`.`estados_actuacion` (`nombre`) VALUES ('Ok'); 
INSERT INTO `proasistencia`.`estados_actuacion` (`nombre`) VALUES ('Anulada'); 

CREATE TABLE `proasistencia`.`estados_presupuesto` (  
  `estadoPresupuestoId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`estadoPresupuestoId`)
);

INSERT INTO `proasistencia`.`estados_presupuesto` (`nombre`) VALUES ('Pendiente de ejecución'); 
INSERT INTO `proasistencia`.`estados_presupuesto` (`nombre`) VALUES ('Pendiente de aceptación'); 
INSERT INTO `proasistencia`.`estados_presupuesto` (`nombre`) VALUES ('Aceptado'); 
INSERT INTO `proasistencia`.`estados_presupuesto` (`nombre`) VALUES ('Rechazado'); 

CREATE TABLE `proasistencia`.`rechazos_presupuesto` (
  `rechazoPresupuestoId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`rechazoPresupuestoId`)
);

INSERT INTO `proasistencia`.`rechazos_presupuesto` (`nombre`) VALUES ('Caro'); 
INSERT INTO `proasistencia`.`rechazos_presupuesto` (`nombre`) VALUES ('Otros'); 

CREATE TABLE `proasistencia`.`actuaciones` (  
  `actuacionId` INT(11) NOT NULL AUTO_INCREMENT,
  `servicioId` INT(11),
  `fechaActuacion` DATE,
  `fechaPrevistaCierre` DATE,
  `facturaIndividual` BOOL,
  `clienteId` INT,
  `facturadaCliente` BOOL,
  `facturaId` INT,
  `proveedorId` INT,
  `facturadaProveedor` BOOL,
  `facproveId` INT,
  `estadoActuacionId` INT,
  `estadoPresupuestoId` INT,
  `rechazoPresupuestoId` INT,
  `notaInterna` TEXT,
  `notaAgente` TEXT,
  `notaProveedor` TEXT,
  PRIMARY KEY (`actuacionId`),
  CONSTRAINT `ref_estados_actuacion` FOREIGN KEY (`estadoActuacionId`) REFERENCES `proasistencia`.`estados_actuacion`(`estadoActuacionId`),
  CONSTRAINT `ref_estados_presupuesto` FOREIGN KEY (`estadoPresupuestoId`) REFERENCES `proasistencia`.`estados_presupuesto`(`estadoPresupuestoId`),
  CONSTRAINT `ref_rechazos_presupuesto` FOREIGN KEY (`rechazoPresupuestoId`) REFERENCES `proasistencia`.`rechazos_presupuesto`(`rechazoPresupuestoId`)
);

CREATE TABLE `proasistencia`.`reparaciones` (  
  `reparacionId` INT NOT NULL AUTO_INCREMENT,
  `actuacionId` INT,
  `fechaReparacion` DATE,
  `articuloId` INT,
  `descripcion` VARCHAR(255),
  `tarifaClienteId` INT,
  `tipoIvaCliente` INT,
  `importeCliente` DECIMAL(12,2),
  `tarifaProveedorId` INT,
  `tipoIvaProveedor` INT,
  `notasCliente` TEXT,
  `notasProveedor` TEXT,
  PRIMARY KEY (`reparacionId`),
  CONSTRAINT `ref_rep_art` FOREIGN KEY (`articuloId`) REFERENCES `proasistencia`.`articulos`(`articuloId`),
  CONSTRAINT `ref_tipoIvaCliente` FOREIGN KEY (`tipoIvaCliente`) REFERENCES `proasistencia`.`tipos_iva`(`tipoIvaId`),
  CONSTRAINT `ref_tipoIvaProveedor` FOREIGN KEY (`tipoIvaProveedor`) REFERENCES `proasistencia`.`tipos_iva`(`tipoIvaId`),
  CONSTRAINT `ref_tarifaCliente` FOREIGN KEY (`tarifaClienteId`) REFERENCES `proasistencia`.`tarifas_cliente`(`tarifaClienteId`),
  CONSTRAINT `ref_tarifaProveedor` FOREIGN KEY (`tarifaProveedorId`) REFERENCES `proasistencia`.`tarifas_proveedor`(`tarifaProveedorId`)
);