ALTER TABLE `partes`   
  ADD COLUMN `prefacturaId` INT(11) NULL AFTER `facturaId`;

ALTER TABLE `prefacturas`   
  ADD COLUMN `noCalculadora` TINYINT(1) DEFAULT 0 NULL AFTER `departamentoId`;
<<<<<<< HEAD

  ALTER TABLE `partes`  
=======
 ALTER TABLE `partes`  
>>>>>>> develop
  ADD CONSTRAINT `ref_parte_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `prefacturas`(`prefacturaId`) ON DELETE SET NULL;

