
ALTER TABLE `contratos_comisionistas`   
  ADD COLUMN `sel` TINYINT(1) DEFAULT 0 NULL AFTER `liquidado`;


  ALTER TABLE `liquidacion_comercial`   
  ADD COLUMN `anticipo` DECIMAL(12,2) NULL AFTER `base`;
