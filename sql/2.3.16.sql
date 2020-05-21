ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `perdtoProveedor` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `perdto`;


UPDATE ofertas_lineas SET perdtoProveedor = perdto;