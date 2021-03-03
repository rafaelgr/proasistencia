ALTER TABLE `partes`   
  ADD COLUMN `antesPre` TINYINT(1) DEFAULT 0 NULL AFTER `imagen`;


UPDATE partes SET antesPre = 1 WHERE NOT facturaId  IS NULL;