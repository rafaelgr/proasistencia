ALTER TABLE `contrato_comercial`   
  ADD COLUMN `obrPorBi` DECIMAL(5,2) DEFAULT 0 NULL AFTER `obrComisionAdicional`;


  ALTER TABLE `liquidacion_comercial`   
  ADD COLUMN `porComer2` DECIMAL(5,2) DEFAULT 0 NULL AFTER `porComer`,
  ADD COLUMN `comision2` DECIMAL(12,2) DEFAULT 0 NULL AFTER `comision`;

