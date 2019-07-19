ALTER TABLE `partes_lineas`   
  ADD COLUMN `facturaLineaId` INT(11) NULL AFTER `totalProveedorIva`,
  ADD COLUMN `facproveLineaId` INT(11) NULL AFTER `facturaLineaId`,
  ADD CONSTRAINT `lineas_parte_factura` FOREIGN KEY (`facturaLineaId`) REFERENCES `facturas_lineas`(`facturaLineaId`) ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `lineas_parte_facprove` FOREIGN KEY (`facproveLineaId`) REFERENCES `facprove_lineas`(`facproveLineaId`) ON UPDATE CASCADE  ON DELETE SET NULL;

ALTER TABLE `partes`   
  ADD COLUMN `empresaParteId` INT(11) NULL AFTER `facproveId`;

  ALTER TABLE `partes`  
  ADD CONSTRAINT `ref_parte_empresa` FOREIGN KEY (`empresaParteId`) REFERENCES `empresas`(`empresaId`);



