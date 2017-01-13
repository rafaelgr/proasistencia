CREATE TABLE `contratos_comisionistas`(  
  `contratoComisionistaId` INT(11) NOT NULL AUTO_INCREMENT,
  `contratoId` INT(11),
  `comercialId` INT(11),
  `comision` DECIMAL(5,2),
  PRIMARY KEY (`contratoComisionistaId`),
  CONSTRAINT `cnt_comisonista_coercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales`(`comercialId`),
  CONSTRAINT `cnt_comisionista_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`)
);


ALTER TABLE `contratos`   
  CHANGE `tipocontratoId` `tipoContratoId` INT(11) NOT NULL COMMENT 'Tipo de el contrato = tipo mantenimiento';

ALTER TABLE `contratos_comisionistas`   
  CHANGE `comision` `porcentajeComision` DECIMAL(5,2) NULL;  