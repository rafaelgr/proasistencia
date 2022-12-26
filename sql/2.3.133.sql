ALTER TABLE `proveedores`   
  ADD COLUMN `nombreRp` VARCHAR(255) NULL AFTER `activa`,
  ADD COLUMN `dniRp` VARCHAR(255) NULL AFTER `nombreRp`,
  ADD COLUMN `tipoViaRpId` INT(11) NULL AFTER `dniRp`,
  ADD COLUMN `direccionRp` VARCHAR(255) NULL AFTER `tipoViaRpId`,
  ADD COLUMN `poblacionRp` VARCHAR(255) NULL AFTER `direccionRp`,
  ADD COLUMN `codPostalRp` VARCHAR(255) NULL AFTER `poblacionRp`,
  ADD COLUMN `provinciaRp` VARCHAR(255) NULL AFTER `codPostalRp`,
  ADD COLUMN `categoriaProfesional` VARCHAR(255) NULL AFTER `provinciaRp`,
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
