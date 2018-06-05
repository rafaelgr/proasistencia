ALTER TABLE `proasistencia`.`contratos`   
  ADD COLUMN `contratoCerrado` TINYINT DEFAULT 0 NULL AFTER `fechaSiguientesFacturas`,
  ADD COLUMN `liquidarBasePrefactura` TINYINT DEFAULT 0 NULL AFTER `contratoCerrado`;
