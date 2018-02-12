CREATE TABLE `grupo_tarifa`(  
  `grupoTarifaId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`grupoTarifaId`)
);

CREATE TABLE `tarifas`(  
  `tarifaId` INT(11) NOT NULL AUTO_INCREMENT,
  `grupoTarifaId` INT(11),
  PRIMARY KEY (`tarifaId`),
  CONSTRAINT `tarifaGrupoTarifaFK` FOREIGN KEY (`grupoTarifaId`) REFERENCES `grupo_tarifa`(`grupoTarifaId`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `tarifa_lineas`(  
  `tarifaLineaId` INT(11) NOT NULL AUTO_INCREMENT,
  `tarifaId` INT(11),
  `articuloId` INT(11),
  `precio` DECIMAL(10,2),
  PRIMARY KEY (`tarifaLineaId`),
  CONSTRAINT `tarifaLineasTarifasFK` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `tarifaLineasArticulosFK` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`articuloId`) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE `tarifa_lineas`   
  ADD  UNIQUE INDEX `artIdUni` (`articuloId`);
