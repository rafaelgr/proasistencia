ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `proveedorId` INT(11) NULL AFTER `capituloLinea`,
  ADD COLUMN `importeProveedor` DECIMAL(10,2) NULL AFTER `proveedorId`,
  ADD COLUMN `totalLineaProveedor` DECIMAL(12,2) NULL AFTER `importeProveedor`,
  ADD COLUMN `tipoIvaProveedorId` INT(11) NULL AFTER `totalLineaProveedor`,
  ADD CONSTRAINT `ofl_proveedores` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`),
  ADD CONSTRAINT `ofl_tipos_iva_proveedor` FOREIGN KEY (`tipoIvaProveedorId`) REFERENCES `tipos_iva`(`tipoIvaId`);
