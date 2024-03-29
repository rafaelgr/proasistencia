SELECT 
'01/01/2017' AS dFecha, '31/12/2017' AS hFecha,
com.comercialId, com.nombre AS nomComercial,
cnt.referencia, cli.nombre AS nomCliente, cnt.direccion,
fac.facturaId, fac.fecha, fac.serie, fac.ano, fac.numero, 
liq.impCliente, liq.base, liq.porComer, liq.comision,
tpm.nombre AS departamento, tpc.nombre AS tipoColaborador
FROM liquidacion_comercial AS liq
LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId
LEFT JOIN contratos AS cnt ON cnt.contratoId = liq.contratoId
LEFT JOIN clientes AS cli ON cli.clienteId = cnt.clienteId
LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId
LEFT JOIN tipos_mantenimiento AS tpm ON tpm.tipoMantenimientoId = cnt.tipoContratoId
LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId

