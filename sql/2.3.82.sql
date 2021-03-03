ALTER TABLE `partes`   
  ADD COLUMN `antesPre` TINYINT(1) DEFAULT 0 NULL AFTER `imagen`;


UPDATE partes SET antesPre = 1 WHERE NOT facturaId  IS NULL;

ALTER TABLE `partes`   
  CHANGE `FactPropiaCli` `FactPropiaCli` TINYINT(1) DEFAULT 1 NULL;


UPDATE partes SET FactPropiaCli = 1 WHERE facturaId IS NULL