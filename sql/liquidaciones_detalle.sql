SELECT c.nombre, tc.nombre AS tipo, lf.*,
CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS facNum, f.fecha AS fechaFactura,
ccm.referencia AS contrato
FROM liquidacion_comercial AS lf
LEFT JOIN facturas AS f ON f.facturaId = lf.facturaId
LEFT JOIN comerciales AS c ON c.comercialId = lf.comercialId
LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId
LEFT JOIN contratos AS ccm ON ccm.contratoId = lf.contratoId
WHERE lf.comercialId = 24
AND f.fecha >= '2017-01-01' AND f.fecha <= '2017-12-31'