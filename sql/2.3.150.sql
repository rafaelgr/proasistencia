ALTER TABLE `liquidacion_comercial`   
  ADD COLUMN `totComision` DECIMAL(12,2) DEFAULT 0 NULL AFTER `comision2`;

ALTER TABLE `liquidacion_comercial`   
  CHANGE `anticipo` `anticipo` DECIMAL(12,2) DEFAULT 0 NULL;

ALTER TABLE `liquidacion_comercial_obras`   
  CHANGE `anticipo` `anticipo` DECIMAL(12,2) DEFAULT 0 NULL;

UPDATE liquidacion_comercial SET anticipo = 0 WHERE anticipo IS NULL;

UPDATE liquidacion_comercial_obras SET anticipo = 0 WHERE anticipo IS NULL;


UPDATE liquidacion_comercial 
  SET totComision = comision + comision2;

UPDATE liquidacion_comercial 
  SET comision = comision + anticipo;