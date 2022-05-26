ALTER TABLE `facprove`   
  ADD COLUMN `esColaborador` TINYINT(1) DEFAULT 0 NULL AFTER `enviadaCorreo`;

ALTER TABLE `antprove` ADD COLUMN `esColaborador` TINYINT(1) DEFAULT 0 NULL AFTER `servicioId`; 

ALTER TABLE `facprove_antproves`   
  ADD COLUMN `antproveServiciadoId` INT(11) NULL AFTER `antproveId`,
  ADD CONSTRAINT `facAnt_antproveServiciado` FOREIGN KEY (`antproveServiciadoId`) 
  REFERENCES `antprove_serviciados`(`antproveServiciadoId`);


ALTER TABLE `contratos_comisionistas`   
  ADD COLUMN `sel` TINYINT(1) DEFAULT 0 NULL AFTER `liquidado`;


  ALTER TABLE `liquidacion_comercial`   
  ADD COLUMN `anticipo` DECIMAL(12,2) NULL AFTER `base`;


ALTER TABLE `liquidacion_comercial_obras`   
  ADD COLUMN `anticipo` DECIMAL(12,2) NULL AFTER `porComer`;


ALTER TABLE `antprove_serviciados`   
  ADD COLUMN `liquidado` TINYINT(1) DEFAULT 0 NULL AFTER `importe`;

  ALTER TABLE `antprove_serviciados`   
  ADD COLUMN `dFecha` DATE NULL AFTER `liquidado`,
  ADD COLUMN `hFecha` DATE NULL AFTER `dFecha`;



#sql insertar antprove_serviciados desde facprove_serviciados


INSERT INTO antprove_serviciados
SELECT 
0 AS antproveServiciadoId,
a.antproveId,
s.empresaId,
s.contratoId,
a.totalconIva AS importe,
0 AS liquidado,
NULL AS dFecha,
NULL AS hFecha
FROM facprove_serviciados s
LEFT JOIN facprove AS fa ON fa.facproveId = s.facproveId
LEFT JOIN facprove_antproves AS f ON f.facproveId = s.facproveId
LEFT JOIN antprove AS a ON a.antproveId = f.antproveId
WHERE a.completo = 0 
AND s.facproveId NOT IN
(
	SELECT 
	s.facproveId
	FROM facprove_serviciados s
	INNER JOIN facprove AS fa ON fa.facproveId = s.facproveId
	INNER JOIN facprove_antproves AS f ON f.facproveId = s.facproveId
	INNER JOIN antprove AS a ON a.antproveId = f.antproveId
	WHERE a.completo = 1
	GROUP BY s.facproveId
	HAVING COUNT(s.facproveId) > 1

)
AND  a.antproveId NOT IN 
(
	SELECT antproveId FROM antprove_serviciados
)

#sql actualizar facprove_antproves  desde antprove_serviciado

UPDATE
antprove_serviciados AS a
INNER JOIN facprove_antproves AS f ON f.antproveId = a.antproveId
SET f.antproveServiciadoId = a.antproveServiciadoId


