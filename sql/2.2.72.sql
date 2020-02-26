ALTER TABLE `partes`   
  ADD COLUMN `fecha_cierre_cliente` DATE NULL AFTER `ofertaId`,
  ADD COLUMN `fecha_cierre_profesional` DATE NULL AFTER `fecha_cierre_cliente`;

