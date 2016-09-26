ALTER TABLE `proasistencia`.`comerciales`   
  ADD COLUMN `ascComercialId` INT(11) NULL  COMMENT 'Comercial asociado, en el caso de los agentes el comercial del que dependen.' AFTER `firmante`,
  ADD CONSTRAINT `fkey_comercial_comercial` FOREIGN KEY (`ascComercialId`) REFERENCES `proasistencia`.`comerciales`(`comercialId`);
