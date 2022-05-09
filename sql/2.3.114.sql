ALTER TABLE `facprove`   
  ADD COLUMN `esColaborador` TINYINT(1) DEFAULT 0 NULL AFTER `enviadaCorreo`;

  CREATE TABLE `facprove_antcols` (
  `facproveAntcolId` int(11) NOT NULL auto_increment,
  `facproveId` int(11) default NULL,
  `antcolId` int(11) default NULL,
  PRIMARY KEY  (`facproveAntcolId`),
  KEY `facAnt_facproveBIS` (`facproveId`),
  KEY `facAnt_antproveBIS` (`antcolId`),
  CONSTRAINT `facAnt_facproveBis` FOREIGN KEY (`facproveId`) REFERENCES `facprove` (`facproveId`),
  CONSTRAINT `facAnt_antcol` FOREIGN KEY (`antcolId`) REFERENCES `antcol` (`antcolId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `antcol`   
  ADD COLUMN `proveedorId` INT(11) NULL AFTER `comercialId`,
  ADD CONSTRAINT `antcol_proveedor` FOREIGN KEY (`proveedorId`) REFERENCES `proasistencia`.`proveedores`(`proveedorId`);
