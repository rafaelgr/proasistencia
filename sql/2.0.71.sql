ALTER TABLE `tipos_proveedor`   
  ADD COLUMN `inicioCuenta` INT(11) NULL AFTER `nombre`;

  CREATE TABLE `proasistencia`.`tipos_profesionales`(  
  `tipoProfesionalId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tipoProfesionalId`)
);