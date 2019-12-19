ALTER TABLE `antprove`   
  ADD COLUMN `conceptoAnticipo` VARCHAR(255) NULL AFTER `departamentoId`;

ALTER TABLE `antprove`   
  ADD COLUMN `completo` TINYINT(1) DEFAULT 0 NULL AFTER `conceptoAnticipo`;  
  
  UPDATE antprove SET completo = 1;
  

  ALTER TABLE `facprove`   
  ADD COLUMN `conceptoAnticipo` VARCHAR(255) NULL AFTER `totalSinAcuenta`;

  ALTER TABLE `facprove`   
  CHANGE `totalSinAcuenta` `restoPagar` DECIMAL(12,2) DEFAULT 0.00 NULL;

  ALTER TABLE `facprove`   
  CHANGE `aCuenta` `importeAnticipo` DECIMAL(12,2) DEFAULT 0.00 NULL;


CREATE TABLE `facprove_antproves`(  
  `facproveAntproveId` INT(11) NOT NULL AUTO_INCREMENT,
  `facproveId` INT,
  `antproveId` INT(11),
  PRIMARY KEY (`facproveAntproveId`),
  CONSTRAINT `facAnt_facprove` FOREIGN KEY (`facproveId`) REFERENCES `facprove`(`facproveId`),
  CONSTRAINT `facAnt_antprove` FOREIGN KEY (`antproveId`) REFERENCES `antprove`(`antproveId`)
);

DROP TABLE IF EXISTS `antclien`;

CREATE TABLE `antclien` (
  `antClienId` int(11) NOT NULL auto_increment,
  `ano` int(11) default NULL,
  `numero` int(11) default NULL,
  `serie` varchar(255) default NULL,
  `tipoProyectoId` int(11) default NULL,
  `fecha` date default NULL,
  `clienteId` int(11) default NULL,
  `empresaId` int(11) default NULL,
  `empresaId2` int(11) default NULL,
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
  `total` decimal(12,2) default NULL,
  `totalConIva` decimal(12,2) default NULL,
  `formaPagoId` int(11) default NULL,
  `observaciones` text,
  `sel` tinyint(1) default '0',
  `totalAlCliente` decimal(12,2) default NULL,
  `coste` decimal(14,4) default NULL,
  `porcentajeBeneficio` decimal(7,4) default NULL,
  `porcentajeAgente` decimal(5,2) default NULL,
  `contratoId` int(11) default NULL,
  `periodo` varchar(255) default NULL,
  `obsAnticipo` text,
  `porcentajeRetencion` decimal(4,2) default NULL,
  `importeRetencion` decimal(12,2) default NULL,
  `numeroAnticipoCliente` varchar(255) default NULL,
  `nombreFacprovePdf` varchar(255) default NULL,
  `ref` varchar(255) default NULL,
  `fecha_recepcion` date default NULL,
  `noContabilizar` tinyint(1) default NULL,
  `contabilizada` tinyint(1) default '0',
  `visada` tinyint(1) default '0',
  `facturaId` int(11) default NULL,
  `departamentoId` int(11) default NULL,
  `conceptoAnticipo` varchar(255) default NULL,
  PRIMARY KEY  (`antClienId`),
  UNIQUE KEY `antprove_numeroprova` (`numeroAnticipoCliente`,`clienteId`),
  KEY `pref_empresas22a` (`empresaId`),
  KEY `pref_proveedores22a` (`clienteId`),
  KEY `pref_formas_pago22a` (`formaPagoId`),
  KEY `pf_tipoProyecto22a` (`tipoProyectoId`),
  KEY `pref_contrato22a` (`contratoId`),
  KEY `antprove_departamento` (`departamentoId`),
  CONSTRAINT `antclien_departamentoFK` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos` (`departamentoId`),
  CONSTRAINT `antclien_contratosFK` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`),
  CONSTRAINT `antclien_empresasFK` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `antclien_formaspagoFK` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `antclien_clientesFK` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `antclien_tipoproyectoFK` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto` (`tipoProyectoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `partes`   
  CHANGE `aCuentaProfesional` `aCuentaProfesional` DECIMAL(12,2) DEFAULT 0 NULL,
  CHANGE `aCuentaCli` `aCuentaCli` DECIMAL(12,2) DEFAULT 0 NULL;


  