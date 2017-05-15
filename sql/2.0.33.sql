ALTER TABLE `tipos_proyecto`   
  ADD COLUMN `tipoMantenimientoId` INT NULL AFTER `abrev`,
  ADD CONSTRAINT `ref_tipoMantenimiento` FOREIGN KEY (`tipoMantenimientoId`) REFERENCES `tipos_mantenimiento`(`tipoMantenimientoId`);