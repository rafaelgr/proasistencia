#AÑADIMOS PRIMERO LAS TABLAS RELACIONADAS CON PREFACTURAS AUTOMÁTICAS

ALTER TABLE `partes`   
  ADD COLUMN `prefacturaAutoId` INT(11) NULL AFTER `facturaId`,
  ADD CONSTRAINT `ref_parte_prefacturasAuto` FOREIGN KEY (`prefacturaAutoId`) 
  REFERENCES `prefacturasauto`(`prefacturaAutoId`);

  ALTER TABLE `partes_lineas` ADD COLUMN `prefacturaAutoLineaId` INT(11) NULL AFTER `prefacturaLineaId`; 


ALTER TABLE `partes_lineas`  
  ADD CONSTRAINT `lineas_parte_prefacturaAuto` FOREIGN KEY (`prefacturaAutoLineaId`) 
  REFERENCES `prefacturasauto_lineas`(`prefacturaAutoLineaId`) ON UPDATE CASCADE ON DELETE SET NULL;


ALTER TABLE `partes` DROP FOREIGN KEY `ref_parte_prefacturasAuto`;

ALTER TABLE `partes` ADD CONSTRAINT `ref_parte_prefacturasAuto` FOREIGN KEY (`prefacturaAutoId`) 
REFERENCES `proasistencia`.`prefacturasauto`(`prefacturaAutoId`) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE `facturas`   
  ADD COLUMN `prefacturaAutoId` INT(11) NULL AFTER `prefacturaId`,
  ADD CONSTRAINT `fac_prefacturasAuto` FOREIGN KEY (`prefacturaAutoId`) REFERENCES `prefacturasauto`(`prefacturaAutoId`);

