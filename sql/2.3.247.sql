ALTER TABLE `prefacturas`   
	ADD COLUMN `noFacturar` TINYINT(1) DEFAULT 0 NULL AFTER `beneficioLineal`;
