ALTER TABLE `grupo_articulo`   
  ADD COLUMN `departamentoId` INT(11) NULL AFTER `cuentaventas`,
  ADD CONSTRAINT `capitulos_departamentoFK` FOREIGN KEY (`departamentoId`) REFERENCES `proasistencia`.`departamentos`(`departamentoId`);


UPDATE articulos  SET grupoArticuloId = 46 WHERE codigoReparacion IN  ('100.06','111.05','111.07','111.06','190.03','190.04','190.05');

UPDATE articulos SET grupoarticuloId = 42 WHERE codigoReparacion IS NOT NULL AND codigoReparacion LIKE '4__%';

UPDATE grupo_articulo AS gp
INNER JOIN articulos AS ar ON ar.grupoArticuloId = gp.grupoarticuloId
SET gp.departamentoId = 7 WHERE ar.codigoReparacion IS NOT NULL;

UPDATE grupo_articulo SET departamentoId = 1 WHERE grupoArticuloId IN
(SELECT tmp.id FROM
(SELECT DISTINCT ga.grupoArticuloId AS id FROM articulos AS ar 
INNER JOIN `grupo_articulo` AS ga ON ga.grupoArticuloId = ar.grupoArticuloid
WHERE codigoReparacion IS NULL AND ga.nombre LIKE '%mantenimiento%' AND ga.departamentoId IS NULL) AS tmp);


UPDATE grupo_articulo SET departamentoId = 2 WHERE grupoArticuloId IN
(SELECT tmp.id FROM
(SELECT DISTINCT ga.grupoArticuloId AS id FROM articulos AS ar 
INNER JOIN `grupo_articulo` AS ga ON ga.grupoArticuloId = ar.grupoArticuloid
WHERE codigoReparacion IS NULL AND ga.nombre LIKE '%seguro%' AND ga.departamentoId IS NULL) AS tmp);

UPDATE grupo_articulo SET departamentoId = 3 WHERE grupoArticuloId IN
(SELECT tmp.id FROM
(SELECT DISTINCT ga.grupoArticuloId AS id FROM articulos AS ar 
INNER JOIN `grupo_articulo` AS ga ON ga.grupoArticuloId = ar.grupoArticuloid
WHERE codigoReparacion IS NULL AND ga.nombre LIKE '%arrendamiento%' AND ga.departamentoId IS NULL) AS tmp);

UPDATE grupo_articulo SET departamentoId = 4 WHERE grupoArticuloId IN
(SELECT tmp.id FROM
(SELECT DISTINCT ga.grupoArticuloId AS id FROM articulos AS ar 
INNER JOIN `grupo_articulo` AS ga ON ga.grupoArticuloId = ar.grupoArticuloid
WHERE codigoReparacion IS NULL AND ga.departamentoId IS NULL AND ga.nombre LIKE '%suplidos%' OR ga.nombre LIKE '%ADMINISTRACIÓN Y GESTIÓN DE FINCA%' ) AS tmp);

