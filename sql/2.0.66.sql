CREATE TABLE `grupo_tarifa`(  
  `grupoTarifaId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`grupoTarifaId`)
);

CREATE TABLE `tarifas`(  
  `tarifaId` INT(11) NOT NULL AUTO_INCREMENT,
  `grupoTarifaId` INT(11),
  `nombre` VARCHAR(255),
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
  ADD CONSTRAINT `fkey_tarifa_cliente` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `proveedores`   
  ADD COLUMN `tarifaId` INT(11) NULL AFTER `fianza`,
  ADD CONSTRAINT `proveedores_tarifa` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `facprove`   
  ADD COLUMN `fecha_recepcion` DATE NULL AFTER `ref`;

  ALTER TABLE `facprove`   
  ADD COLUMN `empresaId2` INT(11) NULL AFTER `empresaId`,
  ADD CONSTRAINT `RX_empresas2` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`);

	ALTER TABLE `tarifas` DROP FOREIGN KEY `tarifaGrupoTarifaFK`;

	ALTER TABLE `tarifas` ADD CONSTRAINT `tarifaGrupoTarifaFK` FOREIGN KEY (`grupoTarifaId`) REFERENCES `grupo_tarifa`(`grupoTarifaId`) ON UPDATE CASCADE ON DELETE NO ACTION;

	ALTER TABLE `proasistencia`.`tarifas_lineas` DROP FOREIGN KEY `tarifaLineasTarifasFK`;

	ALTER TABLE `proasistencia`.`tarifas_lineas` ADD CONSTRAINT `tarifaLineasTarifasFK` FOREIGN KEY (`tarifaId`) REFERENCES `proasistencia`.`tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE NO ACTION;

UPDATE facprove SET fecha_recepcion = fecha;

UPDATE facprove SET empresaId2 = empresaId;