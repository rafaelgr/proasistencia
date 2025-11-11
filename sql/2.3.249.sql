ALTER TABLE `ofertas`   
	ADD COLUMN `visulizaEnErp` TINYINT(1) DEFAULT 0 NULL AFTER `esAdicional`;

ALTER TABLE `contratos`   
	ADD COLUMN `visulizaEnErp` TINYINT(1) DEFAULT 0 NULL AFTER `resumenDiario`;
