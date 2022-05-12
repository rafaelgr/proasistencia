ALTER TABLE `facprove`   
  ADD COLUMN `esColaborador` TINYINT(1) DEFAULT 0 NULL AFTER `enviadaCorreo`;

ALTER TABLE `antprove` ADD COLUMN `esColaborador` TINYINT(1) DEFAULT 0 NULL AFTER `servicioId`; 

ALTER TABLE `facprove_antproves`   
  ADD COLUMN `antproveServiciadoId` INT(11) NULL AFTER `antproveId`,
  ADD CONSTRAINT `facAnt_antproveServiciado` FOREIGN KEY (`antproveServiciadoId`) REFERENCES `proasistencia`.`antprove_serviciados`(`antproveServiciadoId`);


