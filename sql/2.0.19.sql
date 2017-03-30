ALTER TABLE `contratos`   
  ADD COLUMN `direccion` VARCHAR(255) NULL AFTER `obsFactura`,
  ADD COLUMN `codPostal` VARCHAR(255) NULL AFTER `direccion`,
  ADD COLUMN `poblacion` VARCHAR(255) NULL AFTER `codPostal`,
  ADD COLUMN `tipoViaId` INT(11) NULL AFTER `poblacion`,
  ADD CONSTRAINT `cnt_tipoVia` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via`(`tipoViaId`);