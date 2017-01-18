ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `unidadId` INT NULL AFTER `ofertaId`,
  ADD CONSTRAINT `ofl_unidad` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`);

ALTER TABLE `contratos_lineas`   
  ADD COLUMN `unidadId` INT(11) NULL AFTER `contratoId`,
  ADD CONSTRAINT `cntl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`);  

ALTER TABLE `prefacturas_lineas`   
  ADD COLUMN `unidadId` INT(11) NULL AFTER `prefacturaId`,
  ADD CONSTRAINT `prefl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`);
  

ALTER TABLE `facturas_lineas`   
  ADD COLUMN `unidadId` INT(11) NULL AFTER `facturaId`,
  ADD CONSTRAINT `factl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`);