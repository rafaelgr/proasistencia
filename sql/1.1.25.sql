ALTER TABLE `contrato_cliente_mantenimiento`   
  ADD COLUMN `preaviso` INT(11) NULL AFTER `diaPago`;

  UPDATE comerciales SET porComer = 10 WHERE tipoComercialId = 1;

ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento`   
  ADD COLUMN `fechaFactura` DATE NULL AFTER `preaviso`,
  ADD COLUMN `facturaParcial` BOOL NULL AFTER `fechaFactura`;
