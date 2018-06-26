ALTER TABLE `contratos`   
  ADD COLUMN `sel` TINYINT(1) DEFAULT 0 NULL AFTER `liquidarBasePrefactura`;

  ALTER TABLE `facturas`   
  ADD COLUMN `devuelta` TINYINT(1) DEFAULT 0 NULL AFTER `ficheroCorreo`;

