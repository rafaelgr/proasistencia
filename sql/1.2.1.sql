ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `unidadId` INT NULL AFTER `ofertaId`,
  ADD CONSTRAINT `ofl_unidad` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`);

ALTER TABLE `contratos_lineas`   
  ADD COLUMN `unidadId` INT(11) NULL AFTER `contratoId`,
  ADD CONSTRAINT `cntl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`);  

ALTER TABLE `prefacturas_lineas`   
  ADD COLUMN `unidadId` INT(11) NULL AFTER `prefacturaId`,
  ADD CONSTRAINT `prefl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`);
  

ALTER TABLE `facturas_lineas`   
  ADD COLUMN `unidadId` INT(11) NULL AFTER `facturaId`,
  ADD CONSTRAINT `factl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`);

CREATE TABLE `tipos_proyecto` (
  `tipoProyectoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `abrev` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoProyectoId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;


CREATE TABLE `textos_predeterminados` (
  `textoPredeterminadoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `abrev` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`textoPredeterminadoId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;


ALTER TABLE `ofertas`   
  ADD COLUMN `tipoProyectoId` INT(11) NULL AFTER `referencia`,
  ADD CONSTRAINT `of_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto`(`tipoProyectoId`);

ALTER TABLE `contratos`   
  ADD COLUMN `tipoProyectoId` INT(11) NULL AFTER `referencia`,
  ADD CONSTRAINT `cnt_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto`(`tipoProyectoId`);

ALTER TABLE `prefacturas`   
  ADD COLUMN `tipoProyectoId` INT(11) NULL AFTER `serie`,
  ADD CONSTRAINT `pf_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto`(`tipoProyectoId`);  

ALTER TABLE `textos_predeterminados`   
  CHANGE `nombre` `texto` TEXT CHARSET latin1 COLLATE latin1_swedish_ci NULL;
