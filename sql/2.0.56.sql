CREATE TABLE `proveedores` (
  `proveedorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `nif` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `codPostal` varchar(255) DEFAULT NULL,
  `poblacion` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `tipoViaId` int(11) DEFAULT NULL,
  PRIMARY KEY (`proveedorId`),
  KEY `proveedores_tipoVia` (`tipoViaId`),
  CONSTRAINT `proveedores_tipoVia` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via` (`tipoViaId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

