ALTER TABLE `tipos_proyecto` ADD COLUMN `visibleApp` TINYINT(1) DEFAULT 0 NULL AFTER `activo`; 


CREATE TABLE `indices_correctores`(  
  `indiceCorrectorId` INT(11) NOT NULL AUTO_INCREMENT,
  `proveedorId` INT(11),
  `nombre` VARCHAR(255),
  `minimo` DECIMAL(12,2),
  `maximo` DECIMAL(12,2),
  `porcentajeDescuento` DECIMAL(12,2),
  PRIMARY KEY (`indiceCorrectorId`),
  CONSTRAINT `indice_proveedorFK` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`)
) 

CREATE TABLE `indiceCorrector_profesiones`(  
  `indiceCorrectorProfesionId` INT(11) NOT NULL  AUTO_INCREMENT,
  `indiceCorrectorId` INT(11),
  `tipoProfesionalId` INT(11),
  PRIMARY KEY (`indiceCorrectorProfesionId`),
  CONSTRAINT `indiceCorrecorFK` FOREIGN KEY (`indiceCorrectorId`) REFERENCES `indices_correctores`(`indiceCorrectorId`),
  CONSTRAINT `tipoProfesionalFK` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`)
);

ALTER TABLE `ofertas`   
  ADD COLUMN `creadaApp` TINYINT(1) DEFAULT 0 NULL AFTER `servicioId`;






