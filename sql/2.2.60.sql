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

  ALTER TABLE `antprove`   
  DROP COLUMN `fecha_recepcion`;

  ALTER TABLE `antprove`   
  DROP COLUMN `ref`;

ALTER TABLE `antprove`   
  DROP COLUMN `numero`, 
  DROP COLUMN `tipoProyectoId`, 
  DROP INDEX `pf_tipoProyecto22a`,
  DROP FOREIGN KEY `RX_tipoProyecto22a`;

  ALTER TABLE `antprove`   
  DROP COLUMN `ano`, 
  DROP COLUMN `serie`;

ALTER TABLE `antprove`   
  DROP COLUMN `nombreFacprovePdf`;

  ALTER TABLE `antclien`   
  DROP COLUMN `tipoProyectoId`, 
  DROP COLUMN `ref`, 
  DROP COLUMN `fecha_recepcion`, 
  DROP INDEX `pf_tipoProyecto22a`,
  DROP FOREIGN KEY `antclien_tipoproyectoFK`;


  ALTER TABLE `antclien`   
  DROP COLUMN `noContabilizar`;


UPDATE facturas SET restoPagar = totalConIva;
UPDATE facprove SET restoPagar = totalConIva WHERE antproveId IS NULL;
UPDATE facprove SET restoPagar = 0, importeAnticipo = totalConIva WHERE NOT antproveId IS NULL;

ALTER TABLE `antclien`   
  ADD  UNIQUE INDEX `serie_ano_numeroUNIQUE` (`ano`, `numero`, `serie`);


ALTER TABLE `antclien`   
  ADD COLUMN `noContabilizar` TINYINT(1) DEFAULT 0 NULL AFTER `conceptoAnticipo`;



