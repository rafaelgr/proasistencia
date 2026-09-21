CREATE TABLE `prefactura_antcliens` (
  `prefacturaAntclienId` int(11) NOT NULL auto_increment,
  `prefacturaId` int(11) default NULL,
  `antClienId` int(11) default NULL,
  PRIMARY KEY  (`prefacturaAntclienId`),
  UNIQUE KEY `Unique_antclienId` (`antClienId`),
  KEY `prefacAnt_prefactura` (`prefacturaId`),
  KEY `prefacAnt_antclien` (`antClienId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `prefacturas`   
	ADD COLUMN `esCobrado` TINYINT(1) DEFAULT 0 NULL AFTER `prefacturaInteresesId`;


ALTER TABLE `prefactura_antcliens`  
  ADD CONSTRAINT `anticipo_clienteFK` FOREIGN KEY (`antClienId`) REFERENCES `proasistencia`.`antclien`(`antClienId`) ON UPDATE CASCADE ON DELETE CASCADE;
