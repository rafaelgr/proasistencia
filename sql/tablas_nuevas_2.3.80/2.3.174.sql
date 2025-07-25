ALTER TABLE `ofertas`   
  ADD COLUMN `enviada` TINYINT(1) DEFAULT 0 NULL AFTER `beneficioLineal`;

  ALTER TABLE `tipos_proyecto` ADD COLUMN `visibleApp` TINYINT(1) DEFAULT 0 NULL AFTER `activo`; 