ALTER TABLE `partes_lineas`   
  ADD COLUMN `facturaLineaId` INT(11) NULL AFTER `totalProveedorIva`,
  ADD COLUMN `facproveLineaId` INT(11) NULL AFTER `facturaLineaId`,
  ADD CONSTRAINT `lineas_parte_factura` FOREIGN KEY (`facturaLineaId`) REFERENCES `facturas_lineas`(`facturaLineaId`) ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `lineas_parte_facprove` FOREIGN KEY (`facproveLineaId`) REFERENCES `facprove_lineas`(`facproveLineaId`) ON UPDATE CASCADE  ON DELETE SET NULL;


