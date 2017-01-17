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

ALTER TABLE `contratos`   
  ADD COLUMN `fechaInicio` DATE NULL AFTER `totalConIva`,
  ADD COLUMN `fechaFinal` DATE NULL AFTER `fechaInicio`,
  ADD COLUMN `fechaPrimeraFactura` DATE NULL AFTER `fechaFinal`,
  ADD COLUMN `ofertaId` INT(11) NULL COMMENT 'Referencia a la  oferta de la que proviene' AFTER `fechaPrimeraFactura`,
  ADD COLUMN `fechaOriginal` DATE NULL COMMENT 'En las renovaciones de contrato la fecha del contrato original' AFTER `ofertaId`,
  ADD CONSTRAINT `cnt_oferta` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas`(`ofertaId`);

ALTER TABLE `contratos`   
  ADD COLUMN `facturaParcial` BOOL DEFAULT FALSE NULL AFTER `fechaOriginal`;
ALTER TABLE `contratos`   
  ADD COLUMN `preaviso` INT(11) NULL COMMENT 'Meses de preaviso' AFTER `facturaParcial`;  

ALTER TABLE `ofertas`   
  ADD COLUMN `fechaAceptacionOferta` DATE NULL AFTER `totalConIva`,
  ADD COLUMN `contratoId` INT NULL AFTER `fechaAceptacionOferta`,
  ADD CONSTRAINT `of_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`);
ALTER TABLE `contratos_comisionistas` DROP FOREIGN KEY `cnt_comisionista_contrato`;

ALTER TABLE `contratos_comisionistas` ADD CONSTRAINT `cnt_comisionista_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`) ON DELETE CASCADE;

ALTER TABLE `ofertas` DROP FOREIGN KEY `of_contrato`;

ALTER TABLE `ofertas` ADD CONSTRAINT `of_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`) ON DELETE CASCADE;

ALTER TABLE `contratos`   
  CHANGE `fechacontrato` `fechaContrato` DATE NOT NULL COMMENT 'Fecha de creación de el contrato';