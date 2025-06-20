ALTER TABLE `articulos`   
	ADD COLUMN `porcen1` DECIMAL(12,2) DEFAULT 0 NULL AFTER `esTecnico`,
	ADD COLUMN `porcen2` DECIMAL(12,2) DEFAULT 0 NULL AFTER `porcen1`,
    ADD COLUMN `porcen3` DECIMAL(12,2) DEFAULT 0 NULL AFTER `porcen2`,
    ADD COLUMN `porcen4` DECIMAL(12,2) DEFAULT 0 NULL AFTER `porcen3`;

    ALTER TABLE `grupo_articulo`   
	DROP COLUMN `porcen1`, 
	DROP COLUMN `porcen2`, 
	DROP COLUMN `porcen3`, 
	DROP COLUMN `porcen4`;

ALTER TABLE `parametros`   
	ADD COLUMN `limiteImpObra` DECIMAL(12,2) DEFAULT 0 NULL AFTER `indiceCorrector`;


ALTER TABLE `articulos`   
	CHANGE `porcen1` `porcen1` DECIMAL(12,3) DEFAULT 0.00 NULL,
	CHANGE `porcen2` `porcen2` DECIMAL(12,3) DEFAULT 0.00 NULL,
	CHANGE `porcen3` `porcen3` DECIMAL(12,3) DEFAULT 0.00 NULL,
	CHANGE `porcen4` `porcen4` DECIMAL(12,3) DEFAULT 0.00 NULL;



