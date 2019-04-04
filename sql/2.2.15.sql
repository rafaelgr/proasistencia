ALTER TABLE `estados_partes`   
  ADD COLUMN `colorFondo` VARCHAR(255) DEFAULT '#FFFFFF' NULL AFTER `nombre`;


ALTER TABLE `proasistencia`.`servicios`   
  ADD COLUMN `tipoProfesionalId` INT(11) NULL COMMENT 'id del tipo de profesional del servicio' AFTER `clienteId`, 
  ADD  KEY `ref_servicio_tipoProf` (`tipoProfesionalId`),
  ADD CONSTRAINT `ref_servicio_tipoProf` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `proasistencia`.`tipos_profesionales`(`tipoProfesionalId`) ON UPDATE CASCADE ON DELETE NO ACTION;
