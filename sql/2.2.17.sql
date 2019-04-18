ALTER TABLE `estados_partes`   
  ADD COLUMN `colorFondo` VARCHAR(255) DEFAULT '#FFFFFF' NULL AFTER `nombre`;


ALTER TABLE `servicios`   
  ADD COLUMN `tipoProfesionalId` INT(11) NULL COMMENT 'id del tipo de profesional del servicio' AFTER `clienteId`, 
  ADD  KEY `ref_servicio_tipoProf` (`tipoProfesionalId`),
  ADD CONSTRAINT `ref_servicio_tipoProf` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `proasistencia`.`tipos_profesionales`(`tipoProfesionalId`) ON UPDATE CASCADE ON DELETE NO ACTION;

  ALTER TABLE `servicios`   
  ADD COLUMN `numServicio` VARCHAR(255) NULL AFTER `tipoProfesionalId`;

  ALTER TABLE `partes`   
  ADD COLUMN `numParte` VARCHAR(255) NULL AFTER `proveedorId`;

  ALTER TABLE `partes`   
  ADD COLUMN `num` INT(11) NULL AFTER `numParte`;


CREATE TABLE `partes_locales`(  
  `partesLocalesId` INT(11) NOT NULL AUTO_INCREMENT,
  `localesAfectadosId` INT(11),
  `parteId` INT(11),
  PRIMARY KEY (`partesLocalesId`),
  CONSTRAINT `localFK` FOREIGN KEY (`localesAfectadosId`) REFERENCES `locales_afectados`(`localAfectadoId`),
  CONSTRAINT `parteFK` FOREIGN KEY (`parteId`) REFERENCES `partes`(`parteId`)
);


ALTER TABLE `partes`   
  ADD COLUMN `descuentoGeneral` DECIMAL(12,2) NULL AFTER `rechazoPresupuestoId`,
  ADD COLUMN `rappel` DECIMAL(12,2) NULL AFTER `descuentoGeneral`;

  ALTER TABLE `partes`   
  CHANGE `descuentoGeneral` `descuentoGeneral` DECIMAL(12,2) DEFAULT 0 NULL,
  CHANGE `rappel` `rappel` DECIMAL(12,2) DEFAULT 0 NULL;

  ALTER TABLE `partes`   
  ADD COLUMN `hora` VARCHAR(255) DEFAULT '00:00' NULL AFTER `fecha_solicitud`;



UPDATE partes SET `descuentoGeneral` = 0, `rappel`= 0
