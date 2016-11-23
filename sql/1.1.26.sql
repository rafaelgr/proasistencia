ALTER TABLE `proasistencia`.`empresas`   
  ADD COLUMN `seriePre` VARCHAR(255) NULL AFTER `tipoViaId`,
  ADD COLUMN `serieFac` VARCHAR(255) NULL AFTER `seriePre`;