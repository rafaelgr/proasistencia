ALTER TABLE `contratos`   
  ADD COLUMN `certificacionFinal` DECIMAL(12,2) NULL AFTER `intereses`,
  ADD COLUMN `firmaActa` TINYINT(1) DEFAULT 0 NULL AFTER `certificacionFinal`,
  ADD COLUMN `fechaFirmaActa` DATE NULL AFTER `firmaActa`;

  UPDATE facturas SET liquidadaAgente = 1  WHERE  departamentoId = 8 AND ano = '2020'


#TABLA liquidacion_comercial_obras

CREATE TABLE `liquidacion_comercial_obras` (
  `liquidacionComercialObrasId` int(11) NOT NULL auto_increment,
  `facturaId` int(11) default NULL,
  `comercialId` int(11) default NULL,
  `contratoClienteMantenimientoId` int(11) default NULL,
  `impObra` decimal(12,2) default NULL,
  `facturado` decimal(12,2) default NULL,
  `abonado` decimal(12,2) default NULL,
  `pendienteAbono` decimal(12,2) default NULL,
  `CA` decimal(12,2) default NULL,
  `PC` decimal(12,2) default NULL,
  `PCA` decimal(12,2) default NULL,
  `PCO` decimal(12,2) default NULL,
  `ICO` decimal(12,2) default NULL,
  `IJO` decimal(12,2) default NULL,
  `IOT` decimal(12,2) default NULL,
  `IAT` decimal(12,2) default NULL,
  `IC` decimal(12,2) default NULL,
  `porComer` decimal(5,2) default NULL,
  `base` decimal(12,2) default NULL,
  `comision` decimal(12,2) default NULL,
  `contratoId` int(11) default NULL,
  `pendientePeriodo` decimal(12,2) default NULL,
  `pendienteAnterior` decimal(12,2) default NULL,
  `pagadoPeriodo` decimal(12,2) default NULL,
  `pagadoAnterior` decimal(12,2) default NULL,
  `pagadoAnterior30` decimal(12,2) default NULL,
  `pagadoPeriodo30` decimal(12,2) default NULL,
  `pagadoAnterior20` decimal(12,2) default NULL,
  `pagadoPeriodo20` decimal(12,2) default NULL,
  `pagadoAnterior50` decimal(12,2) default NULL,
  `pagadoPeriodo50` decimal(12,2) default NULL,
  `dFecha` date NOT NULL,
  `hFecha` date default NULL,
  PRIMARY KEY  (`liquidacionComercialObrasId`),
  KEY `liq_comer_factura2` (`facturaId`),
  KEY `liq_comer_comercial2` (`comercialId`),
  KEY `liq_comer_contrato2` (`contratoClienteMantenimientoId`),
  KEY `liq_comer_contratos2` (`contratoId`),
  CONSTRAINT `liq_comer_comercial2` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`),
  CONSTRAINT `liq_comer_contrato2` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `liq_comer_contratos2` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`),
  CONSTRAINT `liq_comer_factura2` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
