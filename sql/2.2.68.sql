  CREATE TABLE `empresas_series`(  
  `empresaSerieId` INT(11) NOT NULL AUTO_INCREMENT,
  `empresaId` INT(11),
  `departamentoId` INT(11),
  `tipoProyectoId` INT(11),
  `serie_factura` VARCHAR(255),
  `serie_prefactura` VARCHAR(255),
  PRIMARY KEY (`empresaSerieId`)
);


ALTER TABLE `proasistencia`.`empresas_series`   
  ADD  UNIQUE INDEX `empresaDepTipoProUNIQUE` (`empresaId`, `departamentoId`, `tipoProyectoId`);


ALTER TABLE `proasistencia`.`empresas_series`   
  DROP INDEX `empresaDepTipoProUNIQUE`,
  ADD  UNIQUE INDEX `empresaDepartamentoUNIQUE` (`empresaId`, `departamentoId`),
  ADD  UNIQUE INDEX `empresaTipoProyectoUNIQUE` (`empresaId`, `tipoProyectoId`);
