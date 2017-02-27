ALTER TABLE `empresas`   
  ADD COLUMN `infOfertas` VARCHAR(255) NULL AFTER `serieFacS`;
ALTER TABLE `empresas`   
  ADD COLUMN `infFacturas` VARCHAR(255) NULL AFTER `infOfertas`;