# copiar tablas a partir de carga
USE proasistencia_carga;
DROP TABLE proasistencia.carga_locales;
CREATE TABLE proasistencia.carga_locales
SELECT codigo, nombre, direccion, distrito AS codPostal, poblacion, provincia FROM dba_clientes_locales;

DROP TABLE proasistencia.carga_centrales;
CREATE TABLE proasistencia.carga_centrales
SELECT nif, nombre, direccion, distrito AS codPostal, poblacion, provincia FROM dba_clientes_centrales;

# actualizar los datos en clientes
UPDATE clientes AS c, carga_centrales AS cc
SET c.nombreComercial = cc.nombre, c.direccion = cc.direccion, c.codPostal = cc.codPostal, c.poblacion = cc.poblacion, c.provincia = cc.provincia
WHERE cc.nif = c.nif;

UPDATE clientes AS c, carga_locales AS cc
SET c.nombre = cc.nombre, c.direccion2 = cc.direccion, c.codPostal2 = cc.codPostal, c.poblacion2 = cc.poblacion, c.provincia2 = cc.provincia
WHERE cc.codigo = c.proId;