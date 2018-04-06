ALTER TABLE `tipos_proveedor`   
  ADD COLUMN `inicioCuenta` VARCHAR(255) NULL AFTER `nombre`;

  CREATE TABLE `proasistencia`.`tipo_profesional`(  
  `tipoProfesionalId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tipoProfesionalId`)
);