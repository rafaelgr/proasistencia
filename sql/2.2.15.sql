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


CREATE TABLE `partes_locales` ( 
`partesLocalesId` INT(11) NOT NULL AUTO_INCREMENT,
`loalesAfectadosId` INT(11) COMMENT 'Relacion con la tabla de locales afectados',
`parteId` INT(11) COMMENT 'Referencial a la tabla de partes',
PRIMARY KEY (`partesLocalesId`)
);

