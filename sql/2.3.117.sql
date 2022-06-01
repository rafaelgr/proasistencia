ALTER TABLE `proasistencia`.`mensajes`   
  ADD COLUMN `proveedorId` INT(11) NULL AFTER `parteId`, 
  ADD  INDEX `menasjes_proveedoresFK` (`proveedorId`),
  ADD CONSTRAINT `menasjes_proveedoresFK` FOREIGN KEY (`proveedorId`) REFERENCES `proasistencia`.`proveedores`(`proveedorId`);
