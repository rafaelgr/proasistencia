SELECT f.serie AS serie,
CONCAT(ano, RIGHT(CONCAT('000000',numero),6)) AS factura,
DATE_FORMAT(fecha, '%d/%m/%y') AS fecha,
c.cuentaContable AS cuenta_cli,
fp.codigoContable AS fpago,
0 AS tipo_operacion,
NULL AS cuenta_ret, NULL AS imp_ret, NULL AS tipo_ret,
700000001 AS cuenta_ventas,
NULL AS centro_coste,
fb.base AS imp_venta, fb.porcentaje AS por_iva, fb.cuota AS imp_iva,
NULL AS por_rec, NULL AS imp_rec,
f.totalConIva AS total_factura, 0 AS integracion
FROM facturas  AS f
LEFT JOIN facturas_bases AS fb ON fb.facturaId = f.facturaId
LEFT JOIN clientes AS c ON c.clienteId = f.clienteId
LEFT JOIN formas_pago AS fp ON fp.formaPagoId = c.formaPagoId
ORDER BY serie, factura