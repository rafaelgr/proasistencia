ALTER TABLE `empresas`   
  ADD COLUMN `serieFacR` VARCHAR(255) NULL AFTER `serieFacS`;

INSERT INTO `tipos_mantenimiento`  VALUES (7,'RECTIFICATIVA');