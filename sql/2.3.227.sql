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

INSERT INTO `tipos_profesionales` (`nombre`) VALUES ('JEFE DE OBRAS');

ALTER TABLE `propuestas`   
	ADD COLUMN `garantia` INT(11) NULL AFTER `totalPropuesta`;

CREATE TABLE `propuesta_lineas` (  
  `propuestaLineaId` INT(11) NOT NULL AUTO_INCREMENT,
  `linea` DECIMAL(6,3),
  `propuestaId` INT(11),
  `unidadId` INT(11),
  `articuloId` INT(11),
  `tipoIvaId` INT(11),
  `porcentaje` DECIMAL(5,2),
  `descripcion` TEXT,
  `cantidad` DECIMAL(6,2),
  `importe` DECIMAL(14,4),
  `totalLinea` DECIMAL(12,2),
  `coste` DECIMAL(14,4),
  `capituloLinea` VARCHAR(255),
  `ofertaCostelineaId` INT(11),
  PRIMARY KEY (`propuestaLineaId`) ,
  CONSTRAINT `prol_propuestas` FOREIGN KEY (`propuestaId`) REFERENCES `propuestas`(`propuestaId`),
  CONSTRAINT `prlo_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`articuloId`),
  CONSTRAINT `prol_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva`(`tipoIvaId`),
  CONSTRAINT `prol_unidad` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`),
  CONSTRAINT `prol_ofertaCosteLinea` FOREIGN KEY (`ofertaCostelineaId`) REFERENCES `ofertas_lineas`(`ofertaLineaId`)
);


ALTER TABLE `propuesta_lineas`   
	ADD COLUMN `perdto` DECIMAL(12,2) NULL AFTER `ofertaCostelineaId`,
  ADD COLUMN `costeLinea` DECIMAL(14,4) NULL AFTER `coste`,
	ADD COLUMN `dto` DECIMAL(12,2) NULL AFTER `perdto`;

  ALTER TABLE `propuesta_lineas`   
	ADD COLUMN `propuestaImporte` DECIMAL(12,2) NULL AFTER `dto`,
	ADD COLUMN `propuestaTotalLinea` DECIMAL(12,2) NULL AFTER `propuestaImporte`;


