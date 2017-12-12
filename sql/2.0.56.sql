ALTER TABLE `proasistencia`.`proveedores`   
  ADD COLUMN `tipoViaId` INT(11) NULL AFTER `correo`,
  ADD CONSTRAINT `proveedores_tipoVia` FOREIGN KEY (`tipoViaId`) 
  REFERENCES `proasistencia`.`tipos_via`(`tipoViaId`) 
  ON UPDATE CASCADE ON DELETE CASCADE;