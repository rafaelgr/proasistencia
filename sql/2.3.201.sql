ALTER TABLE `contratos`   
  ADD COLUMN `resumenExp` VARCHAR(255) NULL AFTER `fechaFinAlquiler`,
  ADD COLUMN `resumenJefeObraId` INT(11) NULL AFTER `resumenExp`,
  ADD COLUMN `resumenTecnicoId` INT(11) NULL AFTER `resumenJefeObraId`,
  ADD COLUMN `resumenDistrito` VARCHAR(255) NULL AFTER `resumenTecnicoId`,
  ADD COLUMN `resumenPtoAceptado` TINYINT(1) DEFAULT 0 NULL AFTER `resumenDistrito`,
  ADD COLUMN `resumenAutorizacion` VARCHAR(255) NULL AFTER `resumenPtoAceptado`,
  ADD COLUMN `resumenActa` VARCHAR(255) NULL AFTER `resumenAutorizacion`,
  ADD COLUMN `resumenDni` VARCHAR(255) NULL AFTER `resumenActa`,
  ADD COLUMN `resumenCif` VARCHAR(255) NULL AFTER `resumenDni`,
  ADD COLUMN `resumenTasas` VARCHAR(255) NULL  AFTER `resumenCif`,
  ADD COLUMN `resumenIcio` VARCHAR(255) NULL AFTER `resumenTasas`,
  ADD COLUMN `resumenFormulario` VARCHAR(255) NULL AFTER `resumenIcio`,
  ADD COLUMN `resumenDr` VARCHAR(255) NULL AFTER `resumenFormulario`,
  ADD COLUMN `resumenDiario` TEXT NULL AFTER `resumenDr`;

  ALTER TABLE `contratos` DROP `resumenTecnicoId`; 

CREATE TABLE `contrato_tecnicos`(  
  `contratoTecnicoId` INT(11) NOT NULL AUTO_INCREMENT,
  `contratoId` INT(11) NOT NULL,
  `tecnicoId` INT(11) NOT NULL,
  PRIMARY KEY (`contratoTecnicoId`)
);


ALTER TABLE `contrato_tecnicos`  
  ADD CONSTRAINT `contratoTecnicoFK` FOREIGN KEY (`tecnicoId`) REFERENCES `comerciales`(`comercialId`),
  ADD CONSTRAINT `tecnicoFK` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`);


CREATE TABLE `contratro_tasasvisado`(  
  `tasaVisadoId` INT(11) NOT NULL AUTO_INCREMENT,
  `contratoId` INT(11),
  `titulo` VARCHAR(255) NOT NULL,
  `contenido` TEXT NOT NULL,
  PRIMARY KEY (`tasaVisadoId`),
  CONSTRAINT `contratoTasasFK` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`) ON UPDATE CASCADE ON DELETE CASCADE
);

