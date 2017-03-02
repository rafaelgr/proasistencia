ALTER TABLE `prefacturas`   
  ADD COLUMN `periodo` VARCHAR(255) NULL AFTER `contratoId`;
ALTER TABLE `facturas`   
  ADD COLUMN `periodo` VARCHAR(255) NULL AFTER `contratoId`;