ALTER TABLE `facturas`   
	ADD COLUMN `rectificativaId` INT(11) NULL AFTER `nombreFacturaPdf`,
  ADD CONSTRAINT `factura_rectivicativaFK` FOREIGN KEY (`rectificativaId`) REFERENCES `facturas`(`facturaId`) ON UPDATE CASCADE ON DELETE SET NULL;


ALTER TABLE `contratos`   
	ADD COLUMN `erpId` INT(11) NULL AFTER `visualizaEnErp`;
