CREATE TABLE `contratorenovados`(  
  `contratoRenovadoId` INT(11) NOT NULL AUTO_INCREMENT,
  `contratoOriginalId` INT(11),
  `renovadoId` INT(11),
  `fechaRenovacion` DATE,
  PRIMARY KEY (`contratoRenovadoId`),
  CONSTRAINT `contratoRenovadoFK` FOREIGN KEY (`renovadoId`) REFERENCES `contratos`(`contratoId`)  ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO contratorenovados
(
SELECT 0 AS contratoRenovadoId, tmp.original AS contratoOriginalId, tmp.contratoId AS renovadoId, tmp.fechaInicio AS fechaRenovacion
FROM
(SELECT DISTINCT 
c1.contratoId, c1.referencia, c1.fechaInicio,
( SELECT contratoId FROM contratos WHERE referencia = SUBSTR(c.referencia, 1, INSTR(c.referencia, '.') - 1) AND contratoId NOT IN( 319, 324, 349,350, 317, 337, 344, 353, 331, 422, 391)) AS original,
IF( c1.referencia = SUBSTR(c.referencia, 1, INSTR(c.referencia, '.') - 1), 1 , 0) AS esOriginal
FROM contratos AS c
INNER JOIN contratos AS c1 ON c1.referencia LIKE CONCAT( '%', SUBSTR(c.referencia, 1, INSTR(c.referencia, '.') - 1), '%') AND c1.contratoId NOT IN( 319, 324, 349,350, 317, 337, 344, 353, 331, 422, 391)
INNER JOIN documentacion AS d ON d.contratoId = c.contratoId
WHERE NOT c.antcontratoId IS NULL) AS tmp
WHERE tmp.esOriginal = 0 ORDER BY tmp.original, tmp.fechaInicio
)