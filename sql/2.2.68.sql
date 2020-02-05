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

  #ACTUALIZACIÓN DE EMPRESAS Y SERIES

  INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 2 AS empresaId, 'PM' AS serie_factura, 'PF' AS `serie_prefactura` FROM departamentos
WHERE departamentoId <> 2);

INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 4 AS empresaId, 'FGR' AS serie_factura, 'M' AS `serie_prefactura` FROM departamentos 
WHERE departamentoId <> 2);



INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 4 AS empresaId, 'S' AS serie_factura, 'M' AS `serie_prefactura` FROM departamentos 
WHERE departamentoId = 2);


INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 4 AS empresaId, 'RM' AS serie_factura, 'RP' AS `serie_prefactura` FROM departamentos);

INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 5 AS empresaId, 'A' AS serie_factura, 'P' AS `serie_prefactura` FROM departamentos 
WHERE departamentoId <> 2);

INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 5 AS empresaId, '0' AS serie_factura, 'P' AS `serie_prefactura` FROM departamentos 
WHERE departamentoId = 2);

INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 6 AS empresaId, '0' AS serie_factura, 'P' AS `serie_prefactura` FROM departamentos 
WHERE departamentoId <> 2);


INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 6 AS empresaId, 'R' AS serie_factura, 'P' AS `serie_prefactura` FROM departamentos 
WHERE departamentoId = 2);


INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 7 AS empresaId, NULL AS serie_factura, 'A' AS `serie_prefactura` FROM departamentos);

INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 8 AS empresaId, '00' AS serie_factura, 'C' AS `serie_prefactura` FROM departamentos);


INSERT INTO empresas_series (departamentoId, empresaId, serie_factura, serie_prefactura)
(SELECT  departamentoId, 9 AS empresaId, NULL AS serie_factura, 'PR' AS `serie_prefactura` FROM departamentos);




