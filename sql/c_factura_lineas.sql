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
