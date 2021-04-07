ALTER TABLE `facturas`   
  ADD COLUMN `liquidadaAgente` TINYINT(1) DEFAULT 0 NULL AFTER `esSegura`;

ALTER TABLE `liquidacion_comercial`   
  ADD COLUMN `dFecha` DATE NULL AFTER `pagadoAnterior`,
  ADD COLUMN `hFecha` DATE NULL AFTER `dFecha`;

  UPDATE facturas SET liquidadaAgente= 1 WHERE departamentoId <> 7 AND fecha < 20200101
