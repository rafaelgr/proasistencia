
ALTER TABLE `proasistencia`.`contratos_comisionistas`   
  ADD COLUMN `liquidado` TINYINT(1) DEFAULT 0 NULL AFTER `porcentajeComision`;



UPDATE contratos_comisionistas AS cc
INNER JOIN liquidacion_comercial AS l ON l.contratoId = cc.contratoId AND l.comercialId = cc.comercialId
SET cc.liquidado = 1
WHERE l.facturaId IS NULL AND NOT l.dFecha IS NULL AND NOT l.hFecha IS NULL AND l.dFecha >= 20210101
