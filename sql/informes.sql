# cabeceras
SELECT 
pf.prefacturaId, pf.ano, pf.numero, pf.serie, pf.fecha,
pf.empresaId, pf.clienteId, pf.contratoClienteMantenimientoId,
pf.emisorNif, pf.emisorNombre, pf.emisorDireccion, pf.emisorCodPostal, pf.emisorPoblacion, pf.emisorProvincia,
pf.receptorNif, pf.receptorNombre, pf.receptorDireccion, pf.receptorCodPostal, pf.receptorPoblacion, pf.receptorProvincia,
pf.total, pf.totalConIva, fp.nombre AS formaPago, pf.observaciones
FROM prefacturas AS pf
LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formapagoId;

# lineas
SELECT pfl.*, t.nombre AS tipoIva
FROM prefacturas_lineas AS pfl
LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId

# bases
SELECT pfb.*, t.nombre AS tipoIva
FROM prefacturas_bases AS pfb
LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfb.tipoIvaId
