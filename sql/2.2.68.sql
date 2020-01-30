  CREATE TABLE `empresas_series`(  
  `empresaSerieId` INT(11) NOT NULL AUTO_INCREMENT,
  `empresaId` INT(11),
  `departamentoId` INT(11),
  `tipoProyectoId` INT(11),
  `serie_factura` VARCHAR(255),
  `serie_prefactura` VARCHAR(255),
  PRIMARY KEY (`empresaSerieId`)
);
