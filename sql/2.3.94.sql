ALTER TABLE `proveedores`   
  ADD COLUMN `activa` TINYINT(1) NULL AFTER `empresaId`;


UPDATE proveedores SET activa = 0 WHERE NOT fechaBaja IS NULL;

UPDATE proveedores SET activa = 1 WHERE fechaBaja IS NULL;

ALTER TABLE `liquidacion_comercial_obras`   
  ADD COLUMN `certificacionFinal` DECIMAL(12,2) NULL AFTER `importeObra`;

  ALTER TABLE `liquidacion_comercial_obras`   
  ADD COLUMN `baseAdicional` DECIMAL(12,2) NULL AFTER `baseAnterior`;


  ALTER TABLE `proasistencia`.`liquidacion_comercial_obras`   
  DROP COLUMN `facturaId`, 
  DROP COLUMN `contratoClienteMantenimientoId`, 
  DROP COLUMN `CA`, 
  DROP COLUMN `PC`, 
  DROP COLUMN `PCA`, 
  DROP COLUMN `PCO`, 
  DROP COLUMN `ICO`, 
  DROP COLUMN `IJO`, 
  DROP COLUMN `IOT`, 
  DROP COLUMN `IAT`, 
  DROP COLUMN `IC`, 
  DROP COLUMN `pendientePeriodo`, 
  DROP COLUMN `pendienteAnterior`, 
  DROP COLUMN `pagadoPeriodo`, 
  DROP COLUMN `pagadoAnterior`,
  DROP INDEX `liq_comer_factura2`,
  DROP INDEX `liq_comer_contrato2`,
  DROP FOREIGN KEY `liq_comer_contrato2`,
  DROP FOREIGN KEY `liq_comer_factura2`;

ALTER TABLE `proasistencia`.`liquidacion_comercial_obras`   
  CHANGE `contratoId` `contratoId` INT(11) NULL  AFTER `comercialId`,
  CHANGE `pagadoAnterior30` `pagadoAnterior30` DECIMAL(12,2) NULL  AFTER `baseAdicional`,
  CHANGE `pagadoPeriodo30` `pagadoPeriodo30` DECIMAL(12,2) NULL  AFTER `pagadoAnterior30`,
  CHANGE `pagadoAnterior20` `pagadoAnterior20` DECIMAL(12,2) NULL  AFTER `pagadoPeriodo30`,
  CHANGE `pagadoPeriodo20` `pagadoPeriodo20` DECIMAL(12,2) NULL  AFTER `pagadoAnterior20`,
  CHANGE `pagadoAnterior50` `pagadoAnterior50` DECIMAL(12,2) NULL  AFTER `pagadoPeriodo20`,
  CHANGE `pagadoPeriodo50` `pagadoPeriodo50` DECIMAL(12,2) NULL  AFTER `pagadoAnterior50`,
  CHANGE `porComer` `porComer` DECIMAL(5,2) NULL  AFTER `pagadoPeriodo50`;




