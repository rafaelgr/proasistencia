ALTER TABLE `ofertas`   
	ADD COLUMN `visualizaEnErp` TINYINT(1) DEFAULT 0 NULL AFTER `esAdicional`;

ALTER TABLE `contratos`   
	ADD COLUMN `visualizaEnErp` TINYINT(1) DEFAULT 0 NULL AFTER `resumenDiario`;
