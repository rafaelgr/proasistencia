ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `totalLineaProveedorIva` DECIMAL(12,2) DEFAULT 0 NULL AFTER `dtoProveedor`;
