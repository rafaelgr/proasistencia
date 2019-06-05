ALTER TABLE `facturas`   
  ADD COLUMN `noCalculadora` TINYINT(1) DEFAULT 0 NULL AFTER `departamentoId`;
