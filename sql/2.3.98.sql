ALTER TABLE `proasistencia`.`proveedores`   
  ADD COLUMN `login` VARCHAR(255) NULL AFTER `activa`,
  ADD COLUMN `password` VARCHAR(255) NULL AFTER `login`;

  ALTER TABLE `servicios`   
  ADD COLUMN `proveedorId` INT(11) NULL AFTER `observacionesOperador`,
  ADD CONSTRAINT `ref_servicio_proveedor` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`) ON UPDATE CASCADE ON DELETE NO ACTION;

