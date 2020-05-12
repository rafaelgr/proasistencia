UPDATE ofertas_lineas AS ol
INNER JOIN (SELECT  ti.porcentaje, ofertaLineaId FROM ofertas_lineas AS tl  
INNER JOIN tipos_iva AS ti ON ti.tipoIvaId = tl.tipoIvaProveedorId
WHERE tipoIvaProveedorId IS NOT NULL AND tl.ofertaLineaId IN (SELECT  ofertaLineaId FROM ofertas_lineas WHERE tipoIvaProveedorId IS NOT NULL)
) AS tmp ON tmp.ofertaLineaId = ol.ofertaLineaId
SET ol.porcentajeProveedor = tmp.porcentaje
