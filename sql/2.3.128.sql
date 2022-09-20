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

ALTER TABLE `prefacturas`   
  ADD COLUMN `contPlanificacionId` INT(11) NULL AFTER `contratoPorcenId`,
  ADD CONSTRAINT `pref_contratoPlanificacion` FOREIGN KEY (`contPlanificacionId`) 
  REFERENCES `contrato_planificacion`(`contPlanificacionId`) ON DELETE CASCADE;
