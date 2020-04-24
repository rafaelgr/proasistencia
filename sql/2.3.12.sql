ALTER TABLE `partes_lineas`   
  ADD COLUMN `prefacturaLineaId` INT(11) NULL AFTER `facproveLineaId`,
  ADD CONSTRAINT `lineas_parte_prefactura` FOREIGN KEY (`prefacturaLineaId`) REFERENCES `prefacturas_lineas`(`prefacturaLineaId`) ON UPDATE CASCADE ON DELETE SET NULL;
