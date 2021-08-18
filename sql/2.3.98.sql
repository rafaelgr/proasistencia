ALTER TABLE `proveedores`   
  ADD COLUMN `login` VARCHAR(255) NULL AFTER `activa`,
  ADD COLUMN `password` VARCHAR(255) NULL AFTER `login`;
  
ALTER TABLE `partes`   
  ADD COLUMN `movil` TINYINT(1) DEFAULT 0 NULL AFTER `antesPre`;
