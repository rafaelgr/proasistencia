 INSERT INTO usuarios.`wtiporeten` VALUES(8,'ACTIVIDAD PROFESIONAL 7%', 0, 7.000, 475100003);

 ALTER TABLE `facprove`   
  ADD COLUMN `numregisconta` INT(11) NULL AFTER `departamentoId`;

  
ALTER TABLE `partes`  
  ADD CONSTRAINT `ref_parte_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas`(`facturaId`) ON UPDATE CASCADE ON DELETE SET NULL;

  ALTER TABLE `partes`  
  ADD CONSTRAINT `ref_parte_facprove` FOREIGN KEY (`facproveId`) REFERENCES `facprove`(`facproveId`) ON UPDATE CASCADE ON DELETE SET NULL;

 

