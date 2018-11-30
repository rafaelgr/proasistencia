/*IMPORTAR EN LA BBDD DE PROASISTENCIA EL FICHERO tarifas_temp.sql!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

DROP TABLE tarifas_lineas;

DROP TABLE tarifas;

DROP TABLE grupo_tarifa;


/*CREACION DE ARTICULOS NUEVOS*/

INSERT INTO articulos (codigoReparacion, nombre, grupoArticuloId, precioUnitario, unidadId) 
SELECT DISTINCT  tmp.codigo, tmp.nombre, tmp.grupoArticuloId, tmp.precioUnitario, tmp.unidadId FROM 
(SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM tr_carpinteros
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId  FROM trf_albanyiles
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_antenistas
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_calefactores
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_cerrajeros
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_cristaleros
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_electricistas
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_fontaneros
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_parquetista
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_pintores
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_poceros
UNION 
SELECT codigo, descripcion AS nombre, 28 AS grupoArticuloId, 0.00 AS precioUnitario,  9 AS unidadId FROM trf_pulidos) AS tmp WHERE tmp.codigo IS NOT NULL;

/*CREACION TARIFAS*/

/*TARIFA CLIENTE 1*/
INSERT INTO tarifas_cliente (nombre) VALUES('tarifa_cliente_1');

INSERT INTO tarifas_cliente_lineas (tarifaClienteId,precioUnitario,articuloId)
SELECT  tmp.tarifaClienteId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaClienteId AS tarifaClienteId, codigo, CT1 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT1 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_1') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;

/*TARIFA CLIENTE 2*/

INSERT INTO tarifas_cliente (nombre) VALUES('tarifa_cliente_2');

INSERT INTO tarifas_cliente_lineas (tarifaClienteId,precioUnitario,articuloId)

SELECT  tmp.tarifaClienteId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaClienteId AS tarifaClienteId, codigo, CT2 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT2 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_2') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;

/*TARIFA CLIENTE 3*/

INSERT INTO tarifas_cliente (nombre) VALUES('tarifa_cliente_3');

INSERT INTO tarifas_cliente_lineas (tarifaClienteId,precioUnitario,articuloId)

SELECT  tmp.tarifaClienteId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaClienteId AS tarifaClienteId, codigo, CT3 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT3 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_3') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;


/*TARIFA CLIENTE 4*/

INSERT INTO tarifas_cliente (nombre) VALUES('tarifa_cliente_4');


INSERT INTO tarifas_cliente_lineas (tarifaClienteId,precioUnitario,articuloId)

SELECT  tmp.tarifaClienteId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaClienteId AS tarifaClienteId, codigo, CT4 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4'
UNION 
SELECT ta.tarifaClienteId AS tarifaClienteId,codigo, CT4 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_cliente AS ta ON ta.nombre = 'tarifa_cliente_4') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;


/*TARIFAS PROVEEDORES*/

/*TARIFA PROVEEDOR 1*/

INSERT INTO tarifas_proveedor (nombre) VALUES('tarifa_proveedor_1');

INSERT INTO tarifas_proveedor_lineas (tarifaProveedorId,precioUnitario,articuloId)

SELECT  tmp.tarifaProveedorId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaProveedorId AS tarifaProveedorId, codigo, PT1 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT1 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_1') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;

/*TARIFA PROVEEDOR 2*/

INSERT INTO tarifas_proveedor (nombre) VALUES('tarifa_proveedor_2');

INSERT INTO tarifas_proveedor_lineas (tarifaProveedorId,precioUnitario,articuloId)

SELECT  tmp.tarifaProveedorId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaProveedorId AS tarifaProveedorId, codigo, PT2 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT2 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_2') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;


/*TARIFA PROVEEDOR 3*/

INSERT INTO tarifas_proveedor (nombre) VALUES('tarifa_proveedor_3');

INSERT INTO tarifas_proveedor_lineas (tarifaProveedorId,precioUnitario,articuloId)

SELECT  tmp.tarifaProveedorId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaProveedorId AS tarifaProveedorId, codigo, PT3 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT3 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_3') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;

/*TARIFA PROVEEDOR 4*/

INSERT INTO tarifas_proveedor (nombre) VALUES('tarifa_proveedor_4');

INSERT INTO tarifas_proveedor_lineas (tarifaProveedorId,precioUnitario,articuloId)

SELECT  tmp.tarifaProveedorId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaProveedorId AS tarifaProveedorId, codigo, PT4 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT4 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_4') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;

/*PROVEEDOR TARIFA 5*/

INSERT INTO tarifas_proveedor (nombre) VALUES('tarifa_proveedor_5');

INSERT INTO tarifas_proveedor_lineas (tarifaProveedorId,precioUnitario,articuloId)

SELECT  tmp.tarifaProveedorId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaProveedorId AS tarifaProveedorId, codigo, PT5 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT5 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_5') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;

/*PROVEEDOR TARIFA 6*/

INSERT INTO tarifas_proveedor (nombre) VALUES('tarifa_proveedor_6');

INSERT INTO tarifas_proveedor_lineas (tarifaProveedorId,precioUnitario,articuloId)

SELECT  tmp.tarifaProveedorId, tmp.precio, tmp.articuloId FROM 
(SELECT ta.tarifaProveedorId AS tarifaProveedorId, codigo, PT6 AS precio, ar.articuloId FROM tr_carpinteros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId   FROM trf_albanyiles LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_antenistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_calefactores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_cerrajeros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_cristaleros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_electricistas LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_fontaneros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_parquetista LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_pintores LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_poceros LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6'
UNION 
SELECT ta.tarifaProveedorId AS tarifaProveedorId,codigo, PT6 AS precio, ar.articuloId  FROM trf_pulidos LEFT JOIN articulos AS ar ON ar.codigoReparacion = codigo LEFT JOIN tarifas_proveedor AS ta ON ta.nombre = 'tarifa_proveedor_6') AS tmp 
WHERE tmp.codigo IS NOT NULL AND tmp.precio > 0;