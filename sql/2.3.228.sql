ALTER TABLE `grupo_articulo`   
	DROP COLUMN `aplicarFormula`;

ALTER TABLE `articulos`   
	ADD COLUMN `aplicarFormula` TINYINT(1) DEFAULT 1 NULL AFTER `esTecnico`;


ALTER TABLE `propuestas`  
  DROP FOREIGN KEY `propuesta_tipoProfresion`;


ALTER TABLE `propuestas`   
	CHANGE `tipoProfresionalId` `tipoProfesionalId` INT(11) NULL, 
  DROP INDEX `propuesta_tipoProfresion`,
  ADD  KEY `propuesta_tipoProfresion` (`tipoProfesionalId`);

  ALTER TABLE `propuestas`  
  ADD CONSTRAINT `propuesta_tipoProfesionFK` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`);

