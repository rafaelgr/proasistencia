ALTER TABLE `liquidacion_comercial_obras`   
  ADD COLUMN `adicionalPagadoPeriodo` DECIMAL(12,2) NULL AFTER `baseAdicional`,
  ADD COLUMN `adicionalPagadoAnterior` DECIMAL(12,2) NULL AFTER `adicionalPagadoPeriodo`;
