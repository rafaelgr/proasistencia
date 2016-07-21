SELECT 
pf.prefacturaId, pf.ano, pf.numero, pf.serie, pf.fecha,
pf.empresaId, pf.clienteId, pf.contratoMantenimientoId,
pf.emisorNif, pf.emisorNombre, pf.emisorDireccion, pf.emisorCodPostal, pf.emisorPoblacion, pf.emisorProvincia,
pf.receptorNif, pf.receptorNombre, pf.receptorDireccion, pf.receptorCodPostal, pf.receptorPoblacion, pf.receptorProvincia,
pf.total, pf.totalConIva, fp.nombre AS formaPago, pf.observaciones,
pfl.prefacturaLineaId, pfl.articuloId, t.nombre AS tipoIva, pfl.porcentaje,
pfl.descripcion, pfl.cantidad, pfl
FROM prefacturas AS pf
LEFT JOIN prefacturas_lineas AS pfl ON pfl.prefacturaId = pf.prefacturaId
LEFT JOIN prefacturas_bases AS pfb ON pfb.prefacturaId = pf.prefacturaId
LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formapagoId
LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId