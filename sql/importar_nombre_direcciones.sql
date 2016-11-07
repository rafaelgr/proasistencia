# Eliminar las tablas previas
USE proasistencia;
DROP TABLE carga_centrales;
DROP TABLE carga_locales;
# Ontener los datos para hacer la carga
CREATE TABLE carga_centrales
SELECT * FROM proasistencia_carga.dba_clientes_centrales;
CREATE TABLE carga_locales
SELECT * FROM proasistencia_carga.dba_clientes_locales;
# eliminar los clientes.
DELETE FROM clientes;
# cargar los clientes con los datos sin cuentas
INSERT INTO clientes (proId, nombre, nif,
fechaAlta, fechaBaja,
activa, contacto1, contacto2,
direccion2, codPostal2, poblacion2, provincia2,
telefono1, telefono2, fax, email, formaPagoId, tipoClienteId,
agrupacion, nombreComercial,
direccion, codPostal, poblacion, provincia)
SELECT DISTINCT
cl.codigo AS proId, cl.nombre, cl.nif,
cl.fecha_alta AS fechaAlta, cl.fecha_baja AS fechaBaja,
IF(cl.activo = 'S', 1, 0) AS activa, cl.contacto_1 AS contacto1, cl.contacto_2 AS contacto2,
cl.direccion AS direccion2, cl.distrito AS codPostal2, cl.poblacion AS poblacion2, cl.provincia AS provincia2,
cl.telefono_1 AS telefono1, cl.telefono_2 AS telefono2, cl.fax AS fax, cl.email AS email, 7 AS formaPagoId, 0 AS tipoClienteId,
cl.agrupacion AS agrupacion, cc.nombre AS nombreComercial,
cc.direccion AS direccion, cc.distrito AS codPostal, cc.poblacion AS poblacion, cc.provincia AS provincia
FROM carga_locales  AS cl
LEFT JOIN carga_centrales AS cc ON cc.nif = cl.nif;
