ALTER TABLE `contratos`   
	ADD COLUMN `DFnombre` VARCHAR(255) NULL AFTER `tituloExpediente`,
	ADD COLUMN `DFncolegiado` VARCHAR(255) NULL AFTER `DFnombre`,
	ADD COLUMN `DFcorreo` VARCHAR(255) NULL AFTER `DFncolegiado`,
	ADD COLUMN `DFprofesion` VARCHAR(255) NULL AFTER `DFcorreo`;
