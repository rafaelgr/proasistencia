ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `esTarifa` TINYINT(1) DEFAULT 0 NULL AFTER `totalLineaProveedorIva`;
