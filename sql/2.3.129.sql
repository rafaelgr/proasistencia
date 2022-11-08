ALTER TABLE `contratos`   
  ADD COLUMN `externo` TINYINT(1) DEFAULT 0 NULL AFTER `contratoIntereses`;

  #AJUSTAR IMPORTRE LETRAS PLANIFICACION
  #select * from contrato_planificacion as cc
UPDATE contrato_planificacion AS cc 
INNER JOIN
(
	SELECT c.contratoId, c.referencia, 
	COUNT(p.contPlanificacionId), 
	COALESCE(SUM(p.total), 0) AS importe,
	COALESCE(SUM(f.total), 0) AS importeFactura,
	COALESCE(SUM(f.totalConIva), 0) AS importeFacturaIva,
	p.formaPagoId, 
	fp.nombre, 
	p.contPlanificacionId
	FROM prefacturas AS p 
	LEFT  JOIN facturas  AS f ON f.facturaId = p.facturaId
	LEFT  JOIN contrato_planificacion  AS cp ON cp.`contPlanificacionId` = p.`contPlanificacionId`
	LEFT  JOIN contratos AS c ON c.contratoId = p.contratoId 
	LEFT  JOIN formas_pago  AS fp ON fp.formaPagoId = p.formaPagoId
	WHERE p.formaPagoId <> 23 AND cp.concepto = 'LETRAS' #and cp.contratoId = 2179
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
cc.importeFacturadoIva = cc.importeFacturadoIva - tmp.importeFacturaIva;

#QUITAR CLAVES REFERENCIALES DE LAS PREFACTURAS ELIMINADAS DE LETRAS EN PLANIFICACION
	UPDATE prefacturas AS p
	INNER JOIN 
	(
	SELECT  
	p.prefacturaId
	FROM prefacturas AS p 
	LEFT  JOIN facturas  AS f ON f.facturaId = p.facturaId
	LEFT  JOIN contrato_planificacion  AS cp ON cp.`contPlanificacionId` = p.`contPlanificacionId`
	LEFT  JOIN contratos AS c ON c.contratoId = p.contratoId 
	LEFT  JOIN formas_pago  AS fp ON fp.formaPagoId = p.formaPagoId
	WHERE p.formaPagoId <> 23 AND cp.concepto = 'LETRAS' 
	) AS tmp ON tmp.prefacturaId = p.prefacturaId
	SET p.contPlanificacionId = NULL