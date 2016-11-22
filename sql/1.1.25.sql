ALTER TABLE `contrato_cliente_mantenimiento`   
  ADD COLUMN `preaviso` INT(11) NULL AFTER `diaPago`;
UPDATE comerciales SET porComer = 10 WHERE tipoComercialId = 1;