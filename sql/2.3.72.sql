ALTER TABLE `proveedores`   
  ADD COLUMN `comercialId` INT(11) NULL AFTER `empresaId`,
  ADD CONSTRAINT `proveedores_comerciales` FOREIGN KEY (`comercialId`) REFERENCES `comerciales`(`comercialId`) ON UPDATE CASCADE ON DELETE SET NULL;
