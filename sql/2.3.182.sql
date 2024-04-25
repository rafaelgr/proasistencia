ALTER TABLE `tipos_proyecto` ADD COLUMN `visibleApp` TINYINT(1) DEFAULT 0 NULL AFTER `activo`; 

ALTER TABLE `ofertas` ADD COLUMN `enviadaApp` TINYINT(1) DEFAULT 0 NULL AFTER `beneficioLineal`; 

CREATE TABLE `indices_correctores`(  
  `indiceCorrectorId` INT(11) NOT NULL AUTO_INCREMENT,
  `proveedorId` INT(11),
  `nombre` VARCHAR(255),
  `minimo` DECIMAL(12,2),
  `maximo` DECIMAL(12,2),
  `porcentajeDescuento` DECIMAL(12,2),
  PRIMARY KEY (`indiceCorrectorId`),
  CONSTRAINT `indice_proveedorFK` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`)
) ENGINE=INNODB;




