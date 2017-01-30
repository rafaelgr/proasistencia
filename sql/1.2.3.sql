ALTER TABLE `prefacturas`   
  ADD COLUMN `contratoId` INT(11) NULL AFTER `porcentajeAgente`,
  ADD CONSTRAINT `pref_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`);