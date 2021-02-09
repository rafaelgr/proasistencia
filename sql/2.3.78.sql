ALTER TABLE `usuarios`   
  ADD COLUMN `puedeVisualizar` TINYINT(1) DEFAULT 0 NULL AFTER `departamentoTrabajo`;
