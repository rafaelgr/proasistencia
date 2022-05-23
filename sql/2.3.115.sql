ALTER TABLE `facprove`   
  ADD COLUMN `esColaborador` TINYINT(1) DEFAULT 0 NULL AFTER `enviadaCorreo`;

ALTER TABLE `antprove` ADD COLUMN `esColaborador` TINYINT(1) DEFAULT 0 NULL AFTER `servicioId`; 

ALTER TABLE `facprove_antproves`   
  ADD COLUMN `antproveServiciadoId` INT(11) NULL AFTER `antproveId`,
  ADD CONSTRAINT `facAnt_antproveServiciado` FOREIGN KEY (`antproveServiciadoId`) 
  REFERENCES `antprove_serviciados`(`antproveServiciadoId`);


ALTER TABLE `contratos_comisionistas`   
  ADD COLUMN `sel` TINYINT(1) DEFAULT 0 NULL AFTER `liquidado`;


  ALTER TABLE `liquidacion_comercial`   
  ADD COLUMN `anticipo` DECIMAL(12,2) NULL AFTER `base`;


ALTER TABLE `liquidacion_comercial_obras`   
  ADD COLUMN `anticipo` DECIMAL(12,2) NULL AFTER `porComer`;


ALTER TABLE `antprove_serviciados`   
  ADD COLUMN `liquidado` TINYINT(1) DEFAULT 0 NULL AFTER `importe`;
