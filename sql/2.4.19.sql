ALTER TABLE `facturas`   
	ADD COLUMN `originalId` INT(11) NULL AFTER `rectificativaId`, 
  ADD  KEY `original_factura` (`originalId`);
