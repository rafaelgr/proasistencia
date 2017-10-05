ALTER TABLE `facturas`   
  ADD COLUMN `enviadaCorreo` BOOL DEFAULT FALSE NULL AFTER `prefacturaId`,
  ADD COLUMN `ficheroCorreo` VARCHAR(255) NULL AFTER `enviadaCorreo`;
