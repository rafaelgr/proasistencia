ALTER TABLE `empresas`   
  ADD COLUMN `seriePre` VARCHAR(255) NULL AFTER `tipoViaId`,
  ADD COLUMN `serieFac` VARCHAR(255) NULL AFTER `seriePre`;

ALTER TABLE `clientes`   
  ADD COLUMN `dniFirmante` VARCHAR(255) NULL AFTER `motivoBajaId`,
  ADD COLUMN `firmante` VARCHAR(255) NULL AFTER `dniFirmante`;

  