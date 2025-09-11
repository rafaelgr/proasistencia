ALTER TABLE `empresas`   
	ADD COLUMN `plantillaCorreoArqEncargo` TEXT NULL AFTER `plantillaCorreoArq`;

	ALTER TABLE `propuestas`   
	ADD COLUMN `fechaInicio` DATE NULL AFTER `fechaDocumentacion`;

	ALTER TABLE `propuestas`   
	ADD COLUMN `prevalorada` TINYINT(1) DEFAULT 0 NULL AFTER `fechaInicio`;


