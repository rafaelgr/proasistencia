CREATE TABLE `propuestas` ( 
    `propuestaId` INT(11) NOT NULL AUTO_INCREMENT, 
    `proveedorId` INT(11), 
    `tipoProfresionalId` INT(11), 
    `precioObjetivo` DECIMAL(12,2), 
    `diferencia` DECIMAL(12,2), 
    `pvpNeto` DECIMAL(12,2), 
    `biNeto` DECIMAL(12,2), 
    `ofertaGanadora` TINYINT(1) DEFAULT 0, 
    `plazoEjecucion` INT(11), 
    `penalizacion` DECIMAL(12,2), 
    `totalPropuesta` DECIMAL(12,2), 
    `fechaDocumentacion` DATE, 
    PRIMARY KEY (`propuestaId`) , 
    CONSTRAINT `propuesta_proveedorFK` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`), 
    CONSTRAINT `propuesta_tipoProfresion` FOREIGN KEY (`tipoProfresionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`) ); 

    CREATE TABLE `subcontrata_propuestas` (  
  `subcontrataPropuestaId` INT(11) NOT NULL AUTO_INCREMENT,
  `propuestaId` INT(11),
  `subcontrataId` INT(11),
  PRIMARY KEY (`subcontrataPropuestaId`) ,
  CONSTRAINT `subPropuesta_propuestasFK` FOREIGN KEY (`propuestaId`) REFERENCES `propuestas`(`propuestaId`),
  CONSTRAINT `subPropuesta_subcontrataFK` FOREIGN KEY (`subcontrataId`) REFERENCES `ofertas`(`ofertaId`)
);

INSERT INTO `tipos_profesionales` (`nombre`) VALUES ('JEFE DE OBRAS')
