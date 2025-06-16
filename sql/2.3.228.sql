ALTER TABLE `grupo_articulo`   
	DROP COLUMN `aplicarFormula`;

ALTER TABLE `articulos`   
	ADD COLUMN `aplicarFormula` TINYINT(1) DEFAULT 1 NULL AFTER `esTecnico`;
