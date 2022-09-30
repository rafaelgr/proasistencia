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

ALTER TABLE `proasistencia`.`prefacturas` ADD COLUMN `contPlanificacionId` INT(11) NULL AFTER `contratoPorcenId`, 
  ADD CONSTRAINT `pref_contratoPlanicicacion` FOREIGN KEY (`contPlanificacionId`) 
  REFERENCES `proasistencia`.`contrato_planificacion`(`contPlanificacionId`) ON DELETE CASCADE; 


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






