ALTER TABLE `usuarios`   
  ADD COLUMN `puedeVisualizar` TINYINT(1) DEFAULT 1 NULL AFTER `departamentoTrabajo`;
