ALTER TABLE `contrato_planificacion`   
	ADD COLUMN `esAjuste` TINYINT(1) DEFAULT 0 NULL AFTER `contPlanificacionTempId`;
