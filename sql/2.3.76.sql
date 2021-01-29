ALTER TABLE `tipos_proyecto`   
  ADD COLUMN `activo` TINYINT(1) DEFAULT 1 NULL AFTER `tipoMantenimientoId`;
