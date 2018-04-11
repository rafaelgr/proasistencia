ALTER TABLE `tipos_proveedor`   
  ADD COLUMN `inicioCuenta` INT(11) NULL AFTER `nombre`;

  CREATE TABLE `tipos_profesionales`(  
  `tipoProfesionalId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tipoProfesionalId`)
);

ALTER TABLE `proveedores`   
  ADD COLUMN `tipoProfesionalId` INT(11) NULL AFTER `tipoProveedor`,
  ADD CONSTRAINT `proveedores_tipoProfesional` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`) ON UPDATE CASCADE ON DELETE CASCADE;
