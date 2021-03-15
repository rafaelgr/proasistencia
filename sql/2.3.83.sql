ALTER TABLE `liquidacion_comercial`    
  ADD COLUMN `pendientePeriodo` DECIMAL(12,2) NULL AFTER `contratoId`,
  ADD COLUMN `pendienteAnterior` DECIMAL(12,2) NULL AFTER `pendientePeriodo`,
  ADD COLUMN `pagadoPeriodo` DECIMAL(12,2) NULL AFTER `pendienteAnterior`,
  ADD COLUMN `pagadoAnterior` DECIMAL(12,2) NULL AFTER `pagadoPeriodo`;

  ALTER TABLE `facturas`   
  ADD COLUMN `esSegura` TINYINT(1)  NULL AFTER `noContabilizar`;
