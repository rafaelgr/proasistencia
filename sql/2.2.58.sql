ALTER TABLE `proveedores`   
  ADD COLUMN `tipoIvaId` INT(11) NULL AFTER `tarifaId`,
  ADD CONSTRAINT `proveedores_tiposIva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva`(`tipoIvaId`) ON UPDATE CASCADE ON DELETE SET NULL;

