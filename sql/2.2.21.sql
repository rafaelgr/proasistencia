CREATE TABLE `partes_lineas`(  
  `parteLineaId` INT(11) NOT NULL AUTO_INCREMENT,
  `parteId` INT(11),
  `codigoArticulo` VARCHAR(255),
  `descripcion` VARCHAR(255),
  `unidades` INT(11),
  `precioProveedor` DECIMAL(12,2),
  `precioCliente` DECIMAL(12,2),
  `totalProveedor` DECIMAL(12,2),
  `totalCliente` DECIMAL(12,2),
  PRIMARY KEY (`parteLineaId`),
  CONSTRAINT `linea_parteFK` FOREIGN KEY (`parteId`) REFERENCES `partes`(`parteId`) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE `partes_lineas`   
  CHANGE `totalProveedor` `importeProveedor` DECIMAL(12,2) NULL,
  CHANGE `totalCliente` `importeCliente` DECIMAL(12,2) NULL;


ALTER TABLE `partes`   
  ADD COLUMN `forma_pago_cliente` VARCHAR(255) NULL AFTER `fecha_cobro_cliente`;

  ALTER TABLE `partes`   
  ADD COLUMN `garantia_trabajos` VARCHAR(255) NULL AFTER `rappel`,
  ADD COLUMN `finalizada` TINYINT(1) DEFAULT 0 NULL AFTER `garantia_trabajos`,
  ADD COLUMN `enviar_otro_profesional` TINYINT(1) DEFAULT 0 NULL AFTER `finalizada`;

