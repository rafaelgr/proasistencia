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
