use proasistencia;

INSERT INTO grupo_articulo (nombre,cuentacompras,cuentaventas) VALUES ('PARQUETISTA', '623000001', '700000001' ), 
('CARPINTEROS', '623000001', '700000001' ),
('PULIDOS', '623000001', '700000001' );


UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'FONTANERIA') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '1%' AND LENGTH(codigoReparacion) = 6) AS tma);

 UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'ELECTRICIDAD') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '2%' AND LENGTH(codigoReparacion) = 6) AS tma);

 UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'CERRAJERIA') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '3%' AND LENGTH(codigoReparacion) = 6) AS tma);


 UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'ALBAñILERIA') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '4%' AND LENGTH(codigoReparacion) = 6 OR codigoReparacion LIKE '4%' AND LENGTH(codigoReparacion) = 7) AS tma);


UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'PINTORES') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '5%' AND LENGTH(codigoReparacion) = 6) AS tma);



 UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'POCERIA') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '6%' AND LENGTH(codigoReparacion) = 6) AS tma);


 UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'MANTENIMIENTO DE ANTENAS') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '7%' AND LENGTH(codigoReparacion) = 6) AS tma);

 UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'PARQUETISTA') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '8%' AND LENGTH(codigoReparacion) = 6) AS tma);

UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'CRISTALERIA') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '9%' AND LENGTH(codigoReparacion) = 6) AS tma);
 
 UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'CARPINTEROS') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '10%' AND LENGTH(codigoReparacion) = 7 AND NOT codigoReparacion LIKE '1001.02') AS tma);

 UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'MANTENIMIENTO DE CALDERA') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '11%' AND LENGTH(codigoReparacion) = 7) AS tma);

 UPDATE articulos  SET grupoArticuloId = 
(SELECT tmg.grupoArticuloId FROM 
(SELECT  gp.grupoArticuloId FROM grupo_articulo gp 
WHERE gp.nombre = 'PULIDOS') AS tmg)
WHERE articuloId IN 
(SELECT tma.articuloId FROM 
(SELECT ar.articuloId FROM articulos ar
 WHERE codigoReparacion LIKE '10%' AND LENGTH(codigoReparacion) = 8 OR codigoReparacion = '1001.02') AS tma);
 
 