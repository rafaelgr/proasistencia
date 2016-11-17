ALTER TABLE `proasistencia`.`comerciales`   
  ADD COLUMN `motivoBajaId` INT(11) NULL AFTER `tipoViaId`,
  ADD CONSTRAINT `ref_comercial_motivo` FOREIGN KEY (`motivoBajaId`) REFERENCES `proasistencia`.`motivos_baja`(`motivoBajaId`);