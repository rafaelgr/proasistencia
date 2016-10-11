ALTER TABLE `proasistencia`.`comerciales`   
  ADD COLUMN `iban` VARCHAR(255) NULL AFTER `ascComercialId`;
ALTER TABLE `proasistencia`.`comerciales`   
  ADD COLUMN `porComer` DECIMAL(5,2) NULL AFTER `iban`;
  