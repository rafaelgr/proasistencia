INSERT INTO prefacturas_bases (prefacturaId, tipoIvaId, porcentaje, base, cuota)
SELECT pl.prefacturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota
FROM
(SELECT prefacturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base, 
ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota
FROM prefacturas_lineas
WHERE prefacturaId = 2
GROUP BY tipoIvaId) AS pl
ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota

DELETE FROM prefacturas_bases
WHERE prefacturaId = 2
AND tipoIvaId NOT IN
(SELECT DISTINCT tipoIvaId 
FROM prefacturas_lineas
WHERE prefacturaId = 2);

DELETE FROM prefacturas_bases 
WHERE prefacturaId = '15' AND tipoIvaId NOT IN (SELECT DISTINCT tipoIvaId FROM prefacturas_lineas WHERE prefacturaId = '15')