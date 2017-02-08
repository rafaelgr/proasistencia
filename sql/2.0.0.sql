# Creación de las fcaturas con la misma estructura que las prefacturas
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `facturas`;

CREATE TABLE `facturas` (
  `facturaId` INT(11) NOT NULL AUTO_INCREMENT,
  `ano` INT(11) DEFAULT NULL,
  `numero` INT(11) DEFAULT NULL,
  `serie` VARCHAR(255) DEFAULT NULL,
  `tipoProyectoId` INT(11) DEFAULT NULL,
  `fecha` DATE DEFAULT NULL,
  `empresaId` INT(11) DEFAULT NULL,
  `clienteId` INT(11) DEFAULT NULL,
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
  `totalAlCliente` DECIMAL(12,2) DEFAULT NULL,
  `coste` DECIMAL(12,2) DEFAULT NULL,
  `generada` TINYINT(1) DEFAULT '1',
  `porcentajeBeneficio` DECIMAL(5,2) DEFAULT NULL,
  `porcentajeAgente` DECIMAL(5,2) DEFAULT NULL,
  `contratoId` INT(11) DEFAULT NULL,
  PRIMARY KEY (`facturaId`),
  KEY `fac_empresas` (`empresaId`),
  KEY `fac_clientes` (`clienteId`),
  KEY `fac_formas_pago` (`formaPagoId`),
  KEY `fac_contratos` (`contratoClienteMantenimientoId`),
  KEY `fac_tipoProyecto` (`tipoProyectoId`),
  KEY `fac_contrato` (`contratoId`),
  CONSTRAINT `fac_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto` (`tipoProyectoId`),
  CONSTRAINT `fac_clientes` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `fac_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`),
  CONSTRAINT `fac_contratos` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `fac_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `fac_formas_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=INNODB AUTO_INCREMENT=233 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `facturas_lineas`;

CREATE TABLE `facturas_lineas` (
  `facturaLineaId` INT(11) NOT NULL AUTO_INCREMENT,
  `linea` DECIMAL(6,3) DEFAULT NULL,
  `facturaId` INT(11) DEFAULT NULL,
  `unidadId` INT(11) DEFAULT NULL,
  `articuloId` INT(11) DEFAULT NULL,
  `tipoIvaId` INT(11) DEFAULT NULL,
  `porcentaje` DECIMAL(5,2) DEFAULT NULL,
  `descripcion` TEXT,
  `cantidad` DECIMAL(6,2) DEFAULT NULL,
  `importe` DECIMAL(10,2) DEFAULT NULL,
  `totalLinea` DECIMAL(12,2) DEFAULT NULL,
  `coste` DECIMAL(12,2) DEFAULT NULL,
  `porcentajeBeneficio` DECIMAL(5,2) DEFAULT NULL,
  `porcentajeAgente` DECIMAL(5,2) DEFAULT NULL,
  `capituloLinea` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`facturaLineaId`),
  KEY `factl_facturas` (`facturaId`),
  KEY `factl_articulos` (`articuloId`),
  KEY `factl_tipos_iva` (`tipoIvaId`),
  KEY `factl_unidades` (`unidadId`),
  CONSTRAINT `factl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `factl_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`) ON DELETE CASCADE,
  CONSTRAINT `factl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`),
  CONSTRAINT `factl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=INNODB AUTO_INCREMENT=236 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `facturas_bases`;

CREATE TABLE `facturas_bases` (
  `facturaBaseId` INT(11) NOT NULL AUTO_INCREMENT,
  `facturaId` INT(11) DEFAULT NULL,
  `tipoIvaId` INT(11) DEFAULT NULL,
  `porcentaje` DECIMAL(5,2) DEFAULT NULL,
  `base` DECIMAL(12,2) DEFAULT NULL,
  `cuota` DECIMAL(12,2) DEFAULT NULL,
  PRIMARY KEY (`facturaBaseId`),
  UNIQUE KEY `factb_prefac_iva` (`facturaId`,`tipoIvaId`),
  KEY `factb_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `factb_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`) ON DELETE CASCADE,
  CONSTRAINT `factb_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=INNODB AUTO_INCREMENT=283 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE `facturas` ADD COLUMN `nombreFicheroCont` 
  VARCHAR(255) NULL COMMENT 'Nombre del fichero de exportación a contabilidad' AFTER `contratoId`; 