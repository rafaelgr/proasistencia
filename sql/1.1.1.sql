ALTER TABLE `proasistencia`.`contrato_comercial`   
ADD COLUMN `comision` DECIMAL(5,2) NULL AFTER `manComercial`;
ALTER TABLE `proasistencia`.`contrato_comercial` 
ADD UNIQUE INDEX `idx_empresa_comercial` (`empresaId`, `comercialId`); 
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento`   
  ADD COLUMN `importeMantenedor` DECIMAL(10,2) NULL AFTER `impComer`;
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento`   
  ADD COLUMN `fechaOriginal` DATE NULL AFTER `importeMantenedor`;
ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `codigo` INT(11) NULL AFTER `cuentaCorriente`;  