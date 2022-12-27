ALTER TABLE `proveedores`   
  ADD COLUMN `nombreRp` VARCHAR(255) NULL AFTER `activa`,
  ADD COLUMN `dniRp` VARCHAR(255) NULL AFTER `nombreRp`,
  ADD COLUMN `tipoViaRpId` INT(11) NULL AFTER `dniRp`,
  ADD COLUMN `direccionRp` VARCHAR(255) NULL AFTER `tipoViaRpId`,
  ADD COLUMN `poblacionRp` VARCHAR(255) NULL AFTER `direccionRp`,
  ADD COLUMN `codPostalRp` VARCHAR(255) NULL AFTER `poblacionRp`,
  ADD COLUMN `provinciaRp` VARCHAR(255) NULL AFTER `codPostalRp`,
  ADD COLUMN `categoriaProfesional` VARCHAR(255) NULL AFTER `provinciaRp`,
  ADD COLUMN `nombreRepresentante` VARCHAR(255) NULL AFTER `categoriaProfesional`,
  ADD COLUMN `dniRepresentante` VARCHAR(255) NULL AFTER `nombreRepresentante`,
  ADD CONSTRAINT `proveedores_tiposViaRp` FOREIGN KEY (`tipoViaRpId`) REFERENCES `tipos_via`(`tipoViaId`) 
  ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE `comerciales`   
  ADD COLUMN `nombreRp` VARCHAR(255) NULL AFTER `sel`,
  ADD COLUMN `dniRp` VARCHAR(255) NULL AFTER `nombreRp`,
  ADD COLUMN `tipoViaRpId` INT(11) NULL AFTER `dniRp`,
  ADD COLUMN `direccionRp` VARCHAR(255) NULL AFTER `tipoViaRpId`,
  ADD COLUMN `poblacionRp` VARCHAR(255) NULL AFTER `direccionRp`,
  ADD COLUMN `codPostalRp` VARCHAR(255) NULL AFTER `poblacionRp`,
  ADD COLUMN `provinciaRp` VARCHAR(255) NULL AFTER `codPostalRp`,
  ADD COLUMN `categoriaProfesional` VARCHAR(255) NULL AFTER `provinciaRp`,
  ADD CONSTRAINT `ref_comercial_viaRp` FOREIGN KEY (`tipoViaRpId`) REFERENCES `tipos_via`(`tipoViaId`);


ALTER TABLE `contrato_comercial`   
  ADD COLUMN `obrComisionAdicional` TINYINT(1) DEFAULT 0 NULL AFTER `obrComision`;
  

