ALTER TABLE `proasistencia`.`contrato_comercial`   
ADD COLUMN `comision` DECIMAL(5,2) NULL AFTER `manComercial`;
ALTER TABLE `proasistencia`.`contrato_comercial` 
ADD UNIQUE INDEX `idx_empresa_comercial` (`empresaId`, `comercialId`); 