CREATE TABLE `grupo_tarifa`(  
  `grupoTarifaId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`grupoTarifaId`)
);

CREATE TABLE `tarifas`(  
  `tarifaId` INT(11) NOT NULL AUTO_INCREMENT,
  `grupoTarifaId` INT(11),
  `nombre` VARCHAR(255),
  `precio` DECIMAL(10,2),
  PRIMARY KEY (`tarifaId`),
  CONSTRAINT `tarifaGrupoTarifaFK` FOREIGN KEY (`grupoTarifaId`) REFERENCES `grupo_tarifa`(`grupoTarifaId`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `tarifas_lineas`(  
  `tarifaLineaId` INT(11) NOT NULL AUTO_INCREMENT,
  `tarifaId` INT(11),
  `articuloId` INT(11),
  `precioUnitario` DECIMAL(10,2),
  PRIMARY KEY (`tarifaLineaId`),
  CONSTRAINT `tarifaLineasTarifasFK` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `tarifaLineasArticulosFK` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`articuloId`) ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE INDEX `artIdUni` (`articuloId`, `tarifaId`)
);

ALTER TABLE `clientes`   
  ADD COLUMN `tarifaId` INT(11) NULL AFTER `tipoViaId3`,
  ADD CONSTRAINT `fkey_tarifa_cliente` FOREIGN KEY (`tarifaId`) REFERENCES `proasistencia`.`tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE CASCADE;

