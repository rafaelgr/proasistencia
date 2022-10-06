DROP TABLE IF EXISTS `contrato_planificacion`;

CREATE TABLE `contrato_planificacion` (
  `contPlanificacionId` int(11) NOT NULL auto_increment,
  `contratoId` int(11) default NULL,
  `concepto` varchar(255) default NULL,
  `porcentaje` decimal(12,2) default NULL,
  `fecha` date default NULL,
  `importe` decimal(12,2) default NULL,
  `importeFacturado` decimal(12,2) default NULL,
  `importeCobrado` decimal(12,2) default NULL,
  `formaPagoId` int(11) default NULL,
  PRIMARY KEY  (`contPlanificacionId`),
  KEY `contratos_planificacionFK` (`contratoId`),
  KEY `formaPago_planificacionFK` (`formaPagoId`)
);

ALTER TABLE `prefacturas` ADD COLUMN `contPlanificacionId` INT(11) NULL AFTER `contratoPorcenId`, 
  ADD CONSTRAINT `pref_contratoPlanicicacion` FOREIGN KEY (`contPlanificacionId`) 
  REFERENCES `contrato_planificacion`(`contPlanificacionId`) ON DELETE CASCADE; 


  ALTER TABLE `contrato_planificacion`   
  ADD COLUMN `importePrefacturado` DECIMAL(12,2) NULL AFTER `importeFacturado`;


  ALTER TABLE `contrato_planificacion`   
  CHANGE `importePrefacturado` `importePrefacturado` DECIMAL(12,2) DEFAULT 0 NULL  AFTER `importe`,
  CHANGE `importeFacturado` `importeFacturado` DECIMAL(12,2) DEFAULT 0 NULL,
  CHANGE `importeCobrado` `importeCobrado` DECIMAL(12,2) DEFAULT 0 NULL;

#CREAMOS LOS REGISTROS EN LA NUEVA TABLA contrato_planificacion A PARTIR DE LA TABLA contrato_porcentajes

INSERT INTO contrato_planificacion
SELECT cp.contratoPorcenId AS contPlanificacionId,
cp.contratoId,
cp.concepto,
cp.porcentaje,
cp.fecha,
cp.importe,
0 AS importePrefacturado,
0 AS importeFacturado,
0 AS importeCobrado,
cp.formapagoId 
FROM contrato_porcentajes AS cp
INNER JOIN contratos AS c ON c.contratoId = cp.contratoId
WHERE c.tipocontratoId = 8;

#ACTULIZAMOS LAS REFENCIAS EN LAS PREFACTURAS

UPDATE prefacturas SET contPlanificacionId = contratoPorcenId WHERE NOT contratoPorcenId IS NULL AND departamentoId = 8;

#creacion de linea planificacion de prefacturas no concepto
INSERT INTO contrato_planificacion
SELECT 
0 AS contPlanificacionId,
cc.contratoId,
'LETRAS' AS concepto,
100 - SUM(cp.porcentaje) AS porcentaje,
cp.fecha,
tmp.total AS importe,
0 AS importePrefacturado,
0 AS importeFacturado,
0 AS importeCobrado,
cc.formaPagoId

 FROM contratos AS cc
 INNER JOIN formas_pago AS fp ON fp.formaPagoId = cc.formaPagoId
 INNER JOIN contrato_planificacion AS cp ON cp.contratoId = cc.contratoId 
INNER JOIN
(SELECT 
c1.contratoId AS contratoId, 
SUM(p.total) AS total, 
#c.importeCliente, (SUM(p.total) * 100) / c.importeCliente as porcentage, 
c1.referencia
FROM contratos AS c1
INNER JOIN prefacturas AS p ON p.contratoId = c1.contratoId
LEFT JOIN facturas AS f ON f.facturaId = p.facturaId
WHERE 
p.contPlanificacionId IS NULL  AND 
c1.tipoContratoId = 8 
GROUP BY c1.contratoId) AS tmp ON tmp.contratoId = cc.contratoId
GROUP BY cc.contratoId;

#Actualización de campo contPlanificacionId de prefacturas no concepto
UPDATE contratos AS c
INNER JOIN contrato_planificacion AS cp ON cp.contratoId = c.contratoId 
INNER JOIN prefacturas AS p ON p.contratoId = c.contratoId
SET p.contPlanificacionId = cp.contPlanificacionId
WHERE cp.concepto = 'LETRAS' AND p.contPlanificacionId IS NULL AND c.tipoContratoId = 8

#actulizamos el importe prefacturado en la tabla contrato_planificacion
UPDATE contrato_planificacion AS cp
INNER JOIN
(
	SELECT SUM(p.total) AS total, p.contPlanificacionId FROM prefacturas AS p
	WHERE  p.departamentoId = 8
	GROUP BY p.contPlanificacionId
) AS tmp ON tmp.contPlanificacionId = cp.contPlanificacionId
SET importePrefacturado = tmp.total








