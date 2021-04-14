ALTER TABLE `usuarios`   
  ADD COLUMN `puedeEditar` TINYINT(1) DEFAULT 0 NULL AFTER `puedeVisualizar`;