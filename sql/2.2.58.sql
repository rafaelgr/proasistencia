DROP TABLE IF EXISTS `factura_antcliens`;

CREATE TABLE `factura_antcliens` (
  `facturaAntclienId` int(11) NOT NULL auto_increment,
  `facturaId` int(11) default NULL,
  `antClienId` int(11) default NULL,
  PRIMARY KEY  (`facturaAntclienId`),
  KEY `facAnt_facprove` (`facturaId`),
  KEY `facAnt_antprove` (`antClienId`),
  CONSTRAINT `facturaantcliens_facturaFK` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`),
  CONSTRAINT `facturaantcliens_antcliens` FOREIGN KEY (`antClienId`) REFERENCES `antclien` (`antClienId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `facturas`   
  CHANGE `totalSinAcuenta` `restoPagar` DECIMAL(12,2) DEFAULT 0.00 NULL;

  ALTER TABLE `facturas`   
  CHANGE `aCuenta` `importeAnticipo` DECIMAL(12,2) DEFAULT 0.00 NULL;

  ALTER TABLE `facturas`   
  ADD COLUMN `conceptoAnticipo` VARCHAR(255) NULL AFTER `departamentoId`;
