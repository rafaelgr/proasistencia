UPDATE partes_lineas SET aCuentaProveedor = 0;

ALTER TABLE `facprove`   
  ADD COLUMN `contado` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `importeAnticipo`;
