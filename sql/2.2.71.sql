-- INSERT INTO contratos (empresaId, fechaContrato, tipoContratoId, tipoProyectoId, clienteId , agenteId, fechaInicio, fechaFinal, referencia, coste, 
-- porcentajeBeneficio, importeBeneficio, ventaNeta, porcentajeAgente, importeAgente, importeCliente, importeMantenedor)
-- SELECT tmp.empresaId, tmp.fechaContrato, tmp.tipoContratoId, tmp.tipoProyectoId, tmp.clienteId , tmp.agenteId, tmp.fechaInicio, 
-- tmp.fechaFinal, tmp.referencia, 0 AS coste, 
-- 0 AS porcentajeBeneficio, 
-- 0 AS importeBeneficio, 
-- 0 AS ventaNeta, 
-- 0 AS porcentajeAgente, 
-- 0 AS importeAgente,
-- 0 AS importeCliente, 
-- 0 AS importeMantenedor
--  FROM    
-- (SELECT 2 AS empresaId, c.`fechaContrato`, c.tipoContratoId,c.tipoProyectoId, cli.clienteId , COALESCE(co.comercialId, 1)  AS agenteId,c.fechaInicio, 
-- c.fechaFinal,@rownum:=@rownum+1 AS rownum,CONCAT("GR-",LPAD(@rownum, 5, "0")) AS referencia FROM contratos AS c, (SELECT @rownum:=1) r
-- LEFT  JOIN clientes AS cli ON 1=1
-- LEFT JOIN comerciales AS co ON co.comercialId = cli.comercialId
-- WHERE contratoId = 1844) AS tmp;

ALTER TABLE `partes_lineas`   
  CHANGE `comentarios` `comentarios` TEXT CHARSET utf8 COLLATE utf8_general_ci NULL;

  ALTER TABLE `partes_lineas`   
  CHANGE `descripcion` `descripcion` TEXT CHARSET utf8 COLLATE utf8_general_ci NULL;


-- #CLIENTES REPETIDOS
--   (SELECT nif FROM clientes  WHERE activa = 1 AND NOT CuentaContable IS NULL GROUP BY nif HAVING COUNT(nif) > 1)
-- SELECT nombre,clienteId,nif FROM clientes WHERE clienteId IN
-- (SELECT DISTINCT clienteId FROM contratos WHERE clienteId IN
-- (SELECT clienteId FROM clientes WHERE nif = 'H78630001' OR  nif = 'B87645990' OR  nif = 'H79791950'))