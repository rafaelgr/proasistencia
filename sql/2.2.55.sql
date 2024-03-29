USE `proasistencia`;

/*Table structure for table `oferta_porcentajes` */

DROP TABLE IF EXISTS `oferta_porcentajes`;

CREATE TABLE `oferta_porcentajes` (
  `ofertaPorcenId` int(11) NOT NULL auto_increment,
  `ofertaId` int(11) default NULL,
  `concepto` varchar(255) default NULL,
  `porcentaje` decimal(12,2) default NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY  (`ofertaPorcenId`),
  KEY `contratos_porcentajesFK` (`ofertaId`),
  CONSTRAINT `ofertaConceptoFK` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas` (`ofertaId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `prefacturas`   
  ADD COLUMN `observacionesPago` TEXT NULL AFTER `noCalculadora`;

  ALTER TABLE `facturas`   
  ADD COLUMN `observacionesPago` TEXT NULL AFTER `totalSinAcuenta`;
  
  ALTER TABLE `comerciales` ADD COLUMN `tarifaId` INT(11) NULL AFTER `passWeb`, 
  ADD CONSTRAINT `ref_comercial_tarifa` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas_cliente`(`tarifaClienteId`); 

