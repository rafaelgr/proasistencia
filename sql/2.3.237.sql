ALTER TABLE `expedientes`   
	ADD COLUMN `honorarioVariableId` TINYINT(1) DEFAULT 1 NULL COMMENT '1 = 0% 2 = 2%' AFTER `formaPagoId`;

ALTER TABLE `empresas`   
	ADD COLUMN `plantillaCorreoArq` TEXT NULL AFTER `plantillaCorreoFacturasRep`;
