DROP TABLE IF EXISTS `antprove`;



CREATE TABLE `antprove` (
  `antproveId` INT(11) NOT NULL AUTO_INCREMENT,
  `ano` INT(11) DEFAULT NULL,
  `numero` INT(11) DEFAULT NULL,
  `serie` VARCHAR(255) DEFAULT NULL,
  `tipoProyectoId` INT(11) DEFAULT NULL,
  `fecha` DATE DEFAULT NULL,
  `proveedorId` INT(11) DEFAULT NULL,
  `empresaId` INT(11) DEFAULT NULL,
  `empresaId2` INT(11) DEFAULT NULL,
  `emisorNif` VARCHAR(255) DEFAULT NULL,
  `emisorNombre` VARCHAR(255) DEFAULT NULL,
  `emisorDireccion` VARCHAR(255) DEFAULT NULL,
  `emisorCodPostal` VARCHAR(255) DEFAULT NULL,
  `emisorPoblacion` VARCHAR(255) DEFAULT NULL,
  `emisorProvincia` VARCHAR(255) DEFAULT NULL,
  `receptorNif` VARCHAR(255) DEFAULT NULL,
  `receptorNombre` VARCHAR(255) DEFAULT NULL,
  `receptorDireccion` VARCHAR(255) DEFAULT NULL,
  `receptorCodPostal` VARCHAR(255) DEFAULT NULL,
  `receptorPoblacion` VARCHAR(255) DEFAULT NULL,
  `receptorProvincia` VARCHAR(255) DEFAULT NULL,
  `total` DECIMAL(12,2) DEFAULT NULL,
  `totalConIva` DECIMAL(12,2) DEFAULT NULL,
  `formaPagoId` INT(11) DEFAULT NULL,
  `observaciones` TEXT,
  `sel` TINYINT(1) DEFAULT '0',
  `totalAlCliente` DECIMAL(12,2) DEFAULT NULL,
  `coste` DECIMAL(14,4) DEFAULT NULL,
  `porcentajeBeneficio` DECIMAL(7,4) DEFAULT NULL,
  `porcentajeAgente` DECIMAL(5,2) DEFAULT NULL,
  `contratoId` INT(11) DEFAULT NULL,
  `periodo` VARCHAR(255) DEFAULT NULL,
  `obsAnticipo` TEXT,
  `porcentajeRetencion` DECIMAL(4,2) DEFAULT NULL,
  `importeRetencion` DECIMAL(12,2) DEFAULT NULL,
  `numeroAnticipoProveedor` VARCHAR(255) DEFAULT NULL,
  `nombreFacprovePdf` VARCHAR(255) DEFAULT NULL,
  `ref` VARCHAR(255) DEFAULT NULL,
  `fecha_recepcion` DATE DEFAULT NULL,
  `noContabilizar` TINYINT(1) DEFAULT NULL,
  `contabilizada` TINYINT(1) DEFAULT '0',
  `visada` TINYINT(1) DEFAULT '0',
  PRIMARY KEY  (`antproveId`),
  UNIQUE KEY `antprove_numeroprova` (`numeroAnticipoProveedor`,`proveedorId`),
  KEY `pref_empresas22a` (`empresaId`),
  KEY `pref_proveedores22a` (`proveedorId`),
  KEY `pref_formas_pago22a` (`formaPagoId`),
  KEY `pf_tipoProyecto22a` (`tipoProyectoId`),
  KEY `pref_contrato22a` (`contratoId`),
  CONSTRAINT `RX_contrato22a` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`) ON DELETE CASCADE,
  CONSTRAINT `RX_empresas22a` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `RX_empresas222a` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `RX_formas_pago22a` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `RX_proveedores222a` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`proveedorId`),
  CONSTRAINT `RX_tipoProyecto22a` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto` (`tipoProyectoId`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

/*Table structure for table `antprove_bases` */

DROP TABLE IF EXISTS `antprove_bases`;

CREATE TABLE `antprove_bases` (
  `antproveBaseId` int(11) NOT NULL auto_increment,
  `antproveId` int(11) default NULL,
  `tipoIvaId` int(11) default NULL,
  `porcentaje` decimal(5,2) default NULL,
  `base` decimal(12,2) default NULL,
  `cuota` decimal(12,2) default NULL,
  PRIMARY KEY  (`antproveBaseId`),
  UNIQUE KEY `prefb_prefac_iva2a` (`antproveId`,`tipoIvaId`),
  KEY `prefb_tipos_iva2a` (`tipoIvaId`),
  CONSTRAINT `rx_antproves2a` FOREIGN KEY (`antproveId`) REFERENCES `antprove` (`antproveId`) ON DELETE CASCADE,
  CONSTRAINT `rx_tipos_iva2a` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `antprove_lineas` */

DROP TABLE IF EXISTS `antprove_lineas`;

CREATE TABLE `antprove_lineas` (
  `antproveLineaId` int(11) NOT NULL auto_increment,
  `linea` decimal(6,3) default NULL,
  `antproveId` int(11) default NULL,
  `unidadId` int(11) default NULL,
  `articuloId` int(11) default NULL,
  `tipoIvaId` int(11) default NULL,
  `porcentaje` decimal(5,2) default NULL,
  `descripcion` text,
  `cantidad` decimal(6,2) default NULL,
  `importe` decimal(14,4) default NULL,
  `totalLinea` decimal(12,2) default NULL,
  `coste` decimal(14,4) default NULL,
  `porcentajeBeneficio` decimal(7,4) default NULL,
  `porcentajeAgente` decimal(5,2) default NULL,
  `capituloLinea` varchar(255) default NULL,
  `porcentajeRetencion` decimal(4,2) default '0.00',
  `importeRetencion` decimal(12,2) default '0.00',
  `codigoRetencion` smallint(11) default '0',
  `cuentaRetencion` varchar(10) default NULL,
  PRIMARY KEY  (`antproveLineaId`),
  KEY `prefl_antproves2a` (`antproveId`),
  KEY `prefl_articulos2a` (`articuloId`),
  KEY `prefl_tipos_iva2a` (`tipoIvaId`),
  KEY `prefl_unidades2a` (`unidadId`),
  CONSTRAINT `Xrefl_articulos2a` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `Xrefl_antproves2a` FOREIGN KEY (`antproveId`) REFERENCES `antprove` (`antproveId`) ON DELETE CASCADE,
  CONSTRAINT `Xrefl_tipos_iva2a` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`),
  CONSTRAINT `Xrefl_unidades2a` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `antprove_retenciones` */

DROP TABLE IF EXISTS `antprove_retenciones`;

CREATE TABLE `antprove_retenciones` (
  `antproveRetencionId` int(11) NOT NULL auto_increment,
  `antproveId` int(11) NOT NULL,
  `baseRetencion` decimal(12,2) default NULL,
  `porcentajeRetencion` decimal(4,2) default NULL,
  `importeRetencion` decimal(12,2) default NULL,
  `codigoRetencion` smallint(11) default NULL,
  `cuentaRetencion` varchar(10) default NULL,
  KEY `antproveRetencionId2a` (`antproveRetencionId`),
  KEY `fecproveRetencion_antproveFK2a` (`antproveId`),
  CONSTRAINT `fecproveRetencion_antproveFK2a` FOREIGN KEY (`antproveId`) REFERENCES `antprove` (`antproveId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `antprove_serviciados` */

DROP TABLE IF EXISTS `antprove_serviciados`;

CREATE TABLE `antprove_serviciados` (
  `antproveServiciadoId` int(11) NOT NULL auto_increment,
  `antproveId` int(11) default NULL,
  `empresaId` int(11) default NULL,
  `contratoId` int(11) default NULL,
  `importe` decimal(12,2) default NULL,
  PRIMARY KEY  (`antproveServiciadoId`),
  UNIQUE KEY `serviciados_unique2a` (`antproveId`,`empresaId`,`contratoId`),
  KEY `serviciados_empresaFK2a` (`empresaId`),
  KEY `serviciados_contratoFK2a` (`contratoId`),
  CONSTRAINT `serviciados_contratoFK2a` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `serviciados_empresaFK2a` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `serviciados_antproveFK2a` FOREIGN KEY (`antproveId`) REFERENCES `antprove` (`antproveId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

