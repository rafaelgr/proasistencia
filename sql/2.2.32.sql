ALTER TABLE `partes`  
  ADD CONSTRAINT `ref_parte_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas`(`facturaId`) ON DELETE SET NULL;

  ALTER TABLE `partes`  
  ADD CONSTRAINT `ref_parte_facprove` FOREIGN KEY (`facproveId`) REFERENCES `facprove`(`facproveId`) ON DELETE SET NULL;

 

