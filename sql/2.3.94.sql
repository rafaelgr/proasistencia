ALTER TABLE `proveedores`   
  ADD COLUMN `activa` TINYINT(1) NULL AFTER `empresaId`;


UPDATE proveedores SET activa = 0 WHERE NOT fechaBaja IS NULL;

UPDATE proveedores SET activa = 1 WHERE fechaBaja IS NULL;

ALTER TABLE `liquidacion_comercial_obras`   
  ADD COLUMN `certificacionFinal` DECIMAL(12,2) NULL AFTER `importeObra`;

  ALTER TABLE `liquidacion_comercial_obras`   
  ADD COLUMN `baseAdicional` DECIMAL(12,2) NULL AFTER `baseAnterior`;

