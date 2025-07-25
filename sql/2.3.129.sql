ALTER TABLE `contratos`   
  ADD COLUMN `externo` TINYINT(1) DEFAULT 0 NULL AFTER `contratoIntereses`;

  #AJUSTAR IMPORTRE LETRAS PLANIFICACION

#CREAMOS UNA TABLA TEMPORAL CON LOS REGISTROS QUE VAMOS A DESCONTAR
DROP TABLE tmpContrato_planificacion;
CREATE TABLE tmpContrato_planificacion
#insert into tmpContrato_planificacion
	SELECT
	0 AS contPlanificacionId, 
	c.contratoId,
	fp.nombre AS concepto,
	(COALESCE(SUM(p.total), 0) * 100)/  c.importeCliente AS porcentaje,
	p.fecha AS fecha, 
	COALESCE(SUM(p.total), 0) AS importe,
	COALESCE(SUM(p.total), 0) AS importePrefacturado,
	COALESCE(SUM(f.total), 0) AS importeFacturado,
	COALESCE(SUM(f.totalConIva), 0) AS importeFacturaIva,
	0 AS importeCobrado,
	p.formaPagoId
	FROM prefacturas AS p 
	LEFT  JOIN facturas  AS f ON f.facturaId = p.facturaId
	LEFT  JOIN contrato_planificacion  AS cp ON cp.`contPlanificacionId` = p.`contPlanificacionId`
	LEFT  JOIN contratos AS c ON c.contratoId = p.contratoId 
	LEFT  JOIN formas_pago  AS fp ON fp.formaPagoId = p.formaPagoId
	WHERE p.formaPagoId <> 23 AND cp.concepto = 'LETRAS' AND p.departamentoId = 8
	GROUP BY 
	p.formaPagoId, 
	cp.contPlanificacionId;

#ACTUALIZAMOS LOS IMPORTES EN LA TABLA contrato_planificacion
UPDATE contrato_planificacion AS cc 
INNER JOIN
(
	SELECT c.contratoId, c.referencia, 
	COUNT(p.contPlanificacionId), 
	COALESCE(SUM(p.total), 0) AS importe,
	COALESCE(SUM(f.total), 0) AS importeFactura,
	COALESCE(SUM(f.totalConIva), 0) AS importeFacturaIva,
	c.importeCliente,
	p.formaPagoId, 
	fp.nombre, 
	p.contPlanificacionId
	FROM prefacturas AS p 
	LEFT  JOIN facturas  AS f ON f.facturaId = p.facturaId
	LEFT  JOIN contrato_planificacion  AS cp ON cp.`contPlanificacionId` = p.`contPlanificacionId`
	LEFT  JOIN contratos AS c ON c.contratoId = p.contratoId 
	LEFT  JOIN formas_pago  AS fp ON fp.formaPagoId = p.formaPagoId
	WHERE p.formaPagoId <> 23 AND cp.concepto = 'LETRAS' AND p.departamentoId = 8
	GROUP BY 
	#p.formaPagoId, 
	#cp.contPlanificacionId, 
	c.contratoId
) AS tmp ON tmp.contPlanificacionId = cc.contPlanificacionId 
#where cc.contratoId = 2179
SET
cc.importe = cc.importe - tmp.importe,
cc.importePrefacturado = cc.importePrefacturado - tmp.importe,
cc.importeFacturado = cc.importeFacturado - tmp.importeFactura,
cc.importeFacturadoIva = cc.importeFacturadoIva - tmp.importeFacturaIva,
cc.porcentaje = ((cc.importe - tmp.importe) * 100)/  tmp.importeCliente;

#QUITAMOS LA CLAVE REFERENCIAL DE LAS PREFACTURAS QUE NO PERTENECEN A LAS LINEAS
	UPDATE prefacturas AS p
	INNER JOIN 
	(
	SELECT  DISTINCT
	p.prefacturaId
	FROM prefacturas AS p 
	LEFT  JOIN facturas  AS f ON f.facturaId = p.facturaId
	LEFT  JOIN contrato_planificacion  AS cp ON cp.`contPlanificacionId` = p.`contPlanificacionId`
	LEFT  JOIN contratos AS c ON c.contratoId = p.contratoId 
	LEFT  JOIN formas_pago  AS fp ON fp.formaPagoId = p.formaPagoId
	WHERE p.formaPagoId <> 23 AND cp.concepto = 'LETRAS' 
	) AS tmp ON tmp.prefacturaId = p.prefacturaId
	SET p.contPlanificacionId = NULL;

#CREAMOS LOS NUEVOS REGISTROS EN contrato_planificacion APARTIR DE tmpContrato_planificacion
INSERT INTO contrato_planificacion
SELECT * FROM tmpContrato_planificacion

#UPDATEAMOS LA TABLA TEMPORAL CON LAS CLAVES REFERNCIALES DE LAS LINEAS QUE ACABAMOS DE CERAR EN contrato_planificacion
UPDATE contrato_planificacion AS cp
INNER JOIN tmpContrato_planificacion AS t ON t.contratoId = cp.contratoId AND t.formaPagoId = cp.formaPagoId
SET  t.contPlanificacionId = cp.contPlanificacionId
WHERE cp.concepto IN
(SELECT nombre FROM formas_pago) AND cp.concepto <> 'LETRAS';


#ASIGNAMOS LA CLAVE REFERNCIAL DE LA TABLA TEMPORAL A SUS PREFACTURAS CORRESPONDIENTES
#select t.contPlanificacionId, p.contPlanificacionId from tmpcontrato_planificacion as t
UPDATE  tmpcontrato_planificacion AS t
INNER JOIN prefacturas AS p ON p.contratoId = t.contratoId AND p.formaPagoId = t.formapagoId
SET p.contPlanificacionId = t.contPlanificacionId
WHERE p.contPlanificacionId IS NULL;
  