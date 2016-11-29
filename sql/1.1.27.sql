ALTER TABLE `proasistencia`.`prefacturas`   
  ADD COLUMN `sel` BOOLEAN DEFAULT FALSE  NULL AFTER `observaciones`;

# Crear la tabla de facturas
CREATE TABLE `facturas` (
  `facturaId` INT(11) NOT NULL AUTO_INCREMENT,
  `ano` INT(11) DEFAULT NULL,
  `numero` INT(11) DEFAULT NULL,
  `serie` VARCHAR(255) DEFAULT NULL,
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
  PRIMARY KEY (`facturaId`),
  KEY `fact_empresas` (`empresaId`),
  KEY `fact_clientes` (`clienteId`),
  KEY `fact_formas_pago` (`formaPagoId`),
  KEY `fact_contratos` (`contratoClienteMantenimientoId`),
  CONSTRAINT `fact_clientes` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `fact_contratos` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `fact_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `fact_formas_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=INNODB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

# Crear lineas de facturas
CREATE TABLE `facturas_lineas` (
  `facturaLineaId` INT(11) NOT NULL AUTO_INCREMENT,
  `linea` INT(11) DEFAULT NULL,
  `facturaId` INT(11) DEFAULT NULL,
  `articuloId` INT(11) DEFAULT NULL,
  `tipoIvaId` INT(11) DEFAULT NULL,
  `porcentaje` DECIMAL(5,2) DEFAULT NULL,
  `descripcion` TEXT,
  `cantidad` DECIMAL(6,2) DEFAULT NULL,
  `importe` DECIMAL(10,2) DEFAULT NULL,
  `totalLinea` DECIMAL(12,2) DEFAULT NULL,
  PRIMARY KEY (`facturaLineaId`),
  KEY `factl_facturas` (`facturaId`),
  KEY `factl_articulos` (`articuloId`),
  KEY `factl_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `factl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `factl_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`) ON DELETE CASCADE,
  CONSTRAINT `factl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=INNODB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

# Crear tabla bases
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
) ENGINE=INNODB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8;

# Enlace de prefacturas a facturas
ALTER TABLE `proasistencia`.`prefacturas`   
  ADD COLUMN `facturaId` INT(11) NULL AFTER `sel`,
  ADD CONSTRAINT `pref_facturas` FOREIGN KEY (`facturaId`) REFERENCES `proasistencia`.`facturas`(`facturaId`);

# referencia factura --> prefactura
ALTER TABLE `proasistencia`.`facturas`   
  ADD COLUMN `prefacturaId` INT(11) NULL AFTER `sel`,
  ADD CONSTRAINT `fact_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `proasistencia`.`prefacturas`(`prefacturaId`);

#referencia de contabilización en factura
ALTER TABLE `proasistencia`.`facturas`   
  ADD COLUMN `contafich` VARCHAR(255)  NULL AFTER `prefacturaId`;