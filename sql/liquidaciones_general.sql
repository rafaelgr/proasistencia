SELECT lf.comercialId, c.nombre, tc.nombre AS tipo, SUM(lf.impCliente) AS totFactura, SUM(lf.base) AS totBase, SUM(lf.comision) AS totComision,
'01/01/2017' AS dFecha, '31/12/2017' AS hFecha
FROM liquidacion_comercial AS lf
LEFT JOIN facturas AS f ON f.facturaId = lf.facturaId
LEFT JOIN comerciales AS c ON c.comercialId = lf.comercialId
LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId
WHERE f.fecha >= '2017-01-01' AND f.fecha <= '2017-12-31'
GROUP BY lf.comercialId