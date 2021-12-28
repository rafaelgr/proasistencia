ALTER TABLE `facturas`   
  ADD COLUMN `noCobro` TINYINT(1) DEFAULT 0 NULL AFTER `liquidadaComercial`;
