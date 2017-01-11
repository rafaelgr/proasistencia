CREATE TABLE `ofertas_bases` (
  `ofertaBaseId` int(11) NOT NULL AUTO_INCREMENT,
  `ofertaId` int(11) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `base` decimal(12,2) DEFAULT NULL,
  `cuota` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`ofertaBaseId`),
  UNIQUE KEY `ofb_prefac_iva` (`ofertaId`,`tipoIvaId`),
  KEY `ofb_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `ofb_ofertas` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas` (`ofertaId`) ON DELETE CASCADE,
  CONSTRAINT `ofb_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8;

CREATE TABLE `ofertas_lineas` (
  `ofertaLineaId` int(11) NOT NULL AUTO_INCREMENT,
  `linea` decimal(6,3) DEFAULT NULL,
  `ofertaId` int(11) DEFAULT NULL,
  `articuloId` int(11) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `descripcion` text,
  `cantidad` decimal(6,2) DEFAULT NULL,
  `importe` decimal(10,2) DEFAULT NULL,
  `totalLinea` decimal(12,2) DEFAULT NULL,
  `coste` decimal(12,2) DEFAULT NULL,
  `porcentajeBeneficio` decimal(5,2) DEFAULT NULL,
  `porcentajeAgente` decimal(5,2) DEFAULT NULL,
  `capituloLinea` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ofertaLineaId`),
  KEY `ofl_ofertas` (`ofertaId`),
  KEY `ofl_articulos` (`articuloId`),
  KEY `ofl_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `ofl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `ofl_ofertas` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas` (`ofertaId`) ON DELETE CASCADE,
  CONSTRAINT `ofl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8;

ALTER TABLE `ofertas`   
  ADD COLUMN `total` DECIMAL(12,2) NULL AFTER `formaPagoId`,
  ADD COLUMN `totalConIva` DECIMAL(12,2) NULL AFTER `total`;