ALTER TABLE `partes`   
  ADD COLUMN `prefacturaAutoId` INT(11) NULL AFTER `facturaId`,
  ADD CONSTRAINT `ref_parte_prefacturasAuto` FOREIGN KEY (`prefacturaAutoId`) 
  REFERENCES `prefacturasauto`(`prefacturaAutoId`);


ALTER TABLE `partes_lineas`  
  ADD CONSTRAINT `lineas_parte_prefacturaAuto` FOREIGN KEY (`prefacturaAutoLineaId`) 
  REFERENCES `prefacturasauto_lineas`(`prefacturaAutoLineaId`) ON UPDATE CASCADE ON DELETE SET NULL;
