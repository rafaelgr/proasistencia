ALTER TABLE `propuestas`   
	ADD COLUMN `porcenBiNeto` DECIMAL(12,2) NULL AFTER `biNeto`;

UPDATE Propuestas SET porcenBiNeto = biNeto;

UPDATE Propuestas SET biNeto =  pvpNeto - totalPropuesta