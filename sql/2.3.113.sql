CREATE TABLE `antcol` (
  `antcolId` int(11) NOT NULL auto_increment,
  `fecha` date default NULL,
  `comercialId` int(11) default NULL,
  `empresaId` int(11) default NULL,
  `emisorNif` varchar(255) default NULL,
  `emisorNombre` varchar(255) default NULL,
  `emisorDireccion` varchar(255) default NULL,
  `emisorCodPostal` varchar(255) default NULL,
  `emisorPoblacion` varchar(255) default NULL,
  `emisorProvincia` varchar(255) default NULL,
  `receptorNif` varchar(255) default NULL,
  `receptorNombre` varchar(255) default NULL,
  `receptorDireccion` varchar(255) default NULL,
  `receptorCodPostal` varchar(255) default NULL,
  `receptorPoblacion` varchar(255) default NULL,
  `receptorProvincia` varchar(255) default NULL,
  `totalConIva` decimal(12,2) default NULL,
  `formaPagoId` int(11) default NULL,
  `observaciones` text,
  `sel` tinyint(1) default '0',
  `periodo` varchar(255) default NULL,
  `obsAnticipo` text,
  `numeroAnticipoColaborador` varchar(255) default NULL,
  `departamentoId` int(11) default NULL,
  `conceptoAnticipo` varchar(255) default NULL,
  PRIMARY KEY  (`antcolId`),
  UNIQUE KEY `antcola_numeroprova` (`numeroAnticipoColaborador`,`comercialId`),
  KEY `antcola_empresas` (`empresaId`),
  KEY `antcola_colaborador` (`comercialId`),
  KEY `antcola_formas_pago` (`formaPagoId`),
  KEY `antcola_departamento` (`departamentoId`),
  CONSTRAINT `antcola_empresaFK` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `antcola_colaboradorFK` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`),
  CONSTRAINT `antcola_formas_pagoFK` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `antcola_departamentoFK` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos` (`departamentoId`)
);

CREATE TABLE `antcol_serviciados` (
  `antcolServiciadoId` int(11) NOT NULL auto_increment,
  `antcolId` int(11) default NULL,
  `empresaId` int(11) default NULL,
  `contratoId` int(11) default NULL,
  `importe` decimal(12,2) default NULL,
  PRIMARY KEY  (`antcolServiciadoId`),
  UNIQUE KEY `serviciados_unique2a` (`antcolId`,`empresaId`,`contratoId`),
  KEY `serviciados_empresaFK2aa` (`empresaId`),
  KEY `serviciados_contratoFK2aa` (`contratoId`),
  CONSTRAINT `serviciados_empresaFK2aa` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `serviciados_contratoFK2aa` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`),
  CONSTRAINT `serviciados_antcolFK` FOREIGN KEY (`antcolId`) REFERENCES `antcol` (`antcolId`)
);

ALTER TABLE `contratos_comisionistas`   
  ADD COLUMN `sel` TINYINT(1) DEFAULT 0 NULL AFTER `liquidado`;


  ALTER TABLE `liquidacion_comercial`   
  ADD COLUMN `anticipo` DECIMAL(12,2) NULL AFTER `base`;