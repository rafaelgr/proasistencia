ALTER TABLE `facturas`   
  ADD COLUMN `noContabilizar` TINYINT(1) DEFAULT 0 NULL AFTER `observacionesPago`;
