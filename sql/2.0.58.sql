
CREATE TABLE `facprove` (
  `facproveId` INT(11) NOT NULL AUTO_INCREMENT,
  `ano` INT(11) DEFAULT NULL,
  `numero` INT(11) DEFAULT NULL,
  `serie` VARCHAR(255) DEFAULT NULL,
  `tipoProyectoId` INT(11) DEFAULT NULL,
  `fecha` DATE DEFAULT NULL,
  `proveedorId` INT(11) DEFAULT NULL,
  `empresaId` INT(11) DEFAULT NULL,
  `contratoClienteMantenimientoId` INT(11) DEFAULT NULL,
  `emisorNif` VARCHAR(255) DEFAULT NULL,
  `emisorNombre` VARCHAR(255) DEFAULT NULL,
  `emisorDireccion` VARCHAR(255) DEFAULT NULL,
  `emisorCodPostal` VARCHAR(255) DEFAULT NULL,
  `emisorPoblacion` VARCHAR(255) DEFAULT NULL,
  `emisorProvincia` VARCHAR(255) DEFAULT NULL,
  `receptorNif` VARCHAR(255) DEFAULT NULL,
  `receptorNombre` VARCHAR(255) DEFAULT NULL,
  `receptorDireccion` VARCHAR(255) DEFAULT NULL,
  `receptorCodPostal` VARCHAR(255) DEFAULT NULL,
  `receptorPoblacion` VARCHAR(255) DEFAULT NULL,
  `receptorProvincia` VARCHAR(255) DEFAULT NULL,
  `total` DECIMAL(12,2) DEFAULT NULL,
  `totalConIva` DECIMAL(12,2) DEFAULT NULL,
  `formaPagoId` INT(11) DEFAULT NULL,
  `observaciones` TEXT,
  `sel` TINYINT(1) DEFAULT '0',
  `facturaId` INT(11) DEFAULT NULL,
  `totalAlCliente` DECIMAL(12,2) DEFAULT NULL,
  `coste` DECIMAL(14,4) DEFAULT NULL,
  `generada` TINYINT(1) DEFAULT '1',
  `porcentajeBeneficio` DECIMAL(7,4) DEFAULT NULL,
  `porcentajeAgente` DECIMAL(5,2) DEFAULT NULL,
  `contratoId` INT(11) DEFAULT NULL,
  `periodo` VARCHAR(255) DEFAULT NULL,
  `obsFactura` TEXT,
  `porcentajeRetencion` DECIMAL(4,2) DEFAULT NULL,
  `importeRetencion` DECIMAL(12,2) DEFAULT NULL,
  `mantenedorDesactivado` TINYINT(1) DEFAULT '0',
  PRIMARY KEY (`facproveId`),
  KEY `pref_empresas` (`empresaId`),
  KEY `pref_proveedores` (`proveedorId`),
  KEY `pref_formas_pago` (`formaPagoId`),
  KEY `pref_contratos` (`contratoClienteMantenimientoId`),
  KEY `pref_facturas` (`facturaId`),
  KEY `pf_tipoProyecto` (`tipoProyectoId`),
  KEY `pref_contrato` (`contratoId`),
  CONSTRAINT `RX_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto` (`tipoProyectoId`),
  CONSTRAINT `RX_proveedores` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`proveedorId`),
  CONSTRAINT `RX_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`) ON DELETE CASCADE,
  CONSTRAINT `RX_contratos` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `RX_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `RX_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`),
  CONSTRAINT `RX_formas_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=INNODB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;


CREATE TABLE `facprove_bases` (
  `facproveBaseId` INT(11) NOT NULL AUTO_INCREMENT,
  `facproveId` INT(11) DEFAULT NULL,
  `tipoIvaId` INT(11) DEFAULT NULL,
  `porcentaje` DECIMAL(5,2) DEFAULT NULL,
  `base` DECIMAL(12,2) DEFAULT NULL,
  `cuota` DECIMAL(12,2) DEFAULT NULL,
  PRIMARY KEY (`facproveBaseId`),
  UNIQUE KEY `prefb_prefac_iva` (`facproveId`,`tipoIvaId`),
  KEY `prefb_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `rx_facproves` FOREIGN KEY (`facproveId`) REFERENCES `facprove` (`facproveId`) ON DELETE CASCADE,
  CONSTRAINT `rx_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=INNODB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;



CREATE TABLE `facprove_lineas` (
  `facproveLineaId` INT(11) NOT NULL AUTO_INCREMENT,
  `linea` DECIMAL(6,3) DEFAULT NULL,
  `facproveId` INT(11) DEFAULT NULL,
  `unidadId` INT(11) DEFAULT NULL,
  `articuloId` INT(11) DEFAULT NULL,
  `tipoIvaId` INT(11) DEFAULT NULL,
  `porcentaje` DECIMAL(5,2) DEFAULT NULL,
  `descripcion` TEXT,
  `cantidad` DECIMAL(6,2) DEFAULT NULL,
  `importe` DECIMAL(14,4) DEFAULT NULL,
  `totalLinea` DECIMAL(12,2) DEFAULT NULL,
  `coste` DECIMAL(14,4) DEFAULT NULL,
  `porcentajeBeneficio` DECIMAL(7,4) DEFAULT NULL,
  `porcentajeAgente` DECIMAL(5,2) DEFAULT NULL,
  `capituloLinea` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`facproveLineaId`),
  KEY `prefl_facproves` (`facproveId`),
  KEY `prefl_articulos` (`articuloId`),
  KEY `prefl_tipos_iva` (`tipoIvaId`),
  KEY `prefl_unidades` (`unidadId`),
  CONSTRAINT `Xrefl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `Xrefl_facproves` FOREIGN KEY (`facproveId`) REFERENCES `facprove` (`facproveId`) ON DELETE CASCADE,
  CONSTRAINT `Xrefl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`),
  CONSTRAINT `Xrefl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=INNODB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

ALTER TABLE `proasistencia`.`facprove`   
  DROP COLUMN `contratoClienteMantenimientoId`, 
  DROP COLUMN `facturaId`, 
  DROP INDEX `pref_contratos`,
  DROP INDEX `pref_facturas`,
  DROP FOREIGN KEY `RX_contratos`,
  DROP FOREIGN KEY `RX_facturas`;

  ALTER TABLE `proasistencia`.`facprove`   
  DROP COLUMN `mantenedorDesactivado`;

  ALTER TABLE `proasistencia`.`facprove`   
  DROP COLUMN `generada`;

