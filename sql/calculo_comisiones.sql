SELECT * 
FROM liquidacion_comercial AS lq
WHERE lq.facturaId IN
(SELECT facturaId FROM facturas WHERE fecha >= '2017-01-01' AND fecha <= '2017-12-31'); 

DELETE FROM liquidacion_comercial WHERE facturaId IN 
(SELECT facturaId FROM facturas WHERE fecha >= '2017-01-01' AND fecha <= '2017-12-31');

SELECT f.facturaId, f.fecha, f.serie, f.ano, f.numero, f.totalAlCliente, f.costeproporcional,
cm.contratoClienteMantenimientoId, cm.referencia, cm.tipoMantenimientoId,
cmc.comercialId AS comercialId, c.nombre AS nombreComercial, c.nif AS nifComercial, c.tipoComercialId AS tipoComercial, cmc.porComer,
cm.comercialId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente, c2.tipoComercialId AS tipoAgente, cm.manPorComer AS porAgente,
manComisAgente, manPorImpCliente, manPorImpClienteAgente, manPorCostes, manCostes, manJefeObra, manOficinaTecnica, manAsesortecnico, manComercial,
segComisAgente, segPorImpCliente, segPorImpClienteAgente, segPorCostes, segCostes, segJefeObra, segOficinaTecnica, segAsesortecnico, segComercial
FROM facturas AS f
LEFT JOIN contrato_cliente_mantenimiento AS cm ON cm.contratoClienteMantenimientoid = f.contratoClienteMantenimientoId
LEFT JOIN contrato_cliente_mantenimiento_comisionistas AS cmc ON cmc.contratoClienteMantenimientoId = cm.contratoClienteMantenimientoId
LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = f.empresaId
LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId
LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.comercialId;

