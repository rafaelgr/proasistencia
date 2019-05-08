CREATE TABLE `partes_lineas`(  
  `parteLineaId` INT(11) NOT NULL AUTO_INCREMENT,
  `parteId` INT(11),
  `codigoArticulo` VARCHAR(255),
  `Descripcion` VARCHAR(255),
  `unidades` INT(11),
  `precioProveedor` DECIMAL(12,2),
  `precioCliente` DECIMAL(12,2),
  `totalProveedor` DECIMAL(12,2),
  `totalCliente` DECIMAL(12,2),
  PRIMARY KEY (`parteLineaId`),
  CONSTRAINT `linea_parteFK` FOREIGN KEY (`parteId`) REFERENCES `partes`(`parteId`) ON UPDATE CASCADE ON DELETE CASCADE
);
