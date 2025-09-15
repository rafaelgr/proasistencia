ALTER TABLE `empresas`   
	ADD COLUMN `plantillaCorreoArqEncargo` TEXT NULL AFTER `plantillaCorreoArq`;

	ALTER TABLE `propuestas`   
	ADD COLUMN `fechaInicio` DATE NULL AFTER `fechaDocumentacion`;

	ALTER TABLE `propuestas`   
	ADD COLUMN `prevalorada` TINYINT(1) DEFAULT 0 NULL AFTER `fechaInicio`;


ALTER TABLE `propuesta_lineas`   
	ADD COLUMN `ofertaSubcontratalineaId` INT(11) NULL AFTER `ofertaCostelineaId`;
