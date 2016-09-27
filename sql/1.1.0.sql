ALTER TABLE `proasistencia`.`comerciales`   
  ADD COLUMN `ascComercialId` INT(11) NULL  COMMENT 'Comercial asociado, en el caso de los agentes el comercial del que dependen.' AFTER `firmante`,
  ADD CONSTRAINT `fkey_comercial_comercial` FOREIGN KEY (`ascComercialId`) REFERENCES `proasistencia`.`comerciales`(`comercialId`);
ALTER TABLE `proasistencia`.`contrato_comercial`   
  DROP COLUMN `manPorVentaNeta`, 
  DROP COLUMN `manPorBeneficio`;
ALTER TABLE `proasistencia`.`contrato_comercial`   
  ADD COLUMN `manComisAgente` BOOL NULL AFTER `firmanteColaborador`,
  ADD COLUMN `manPorImpCliente` DECIMAL(5,2) NULL AFTER `manComisAgente`,
  ADD COLUMN `manPorImpClienteAgente` DECIMAL(5,2) NULL AFTER `manPorImpCliente`,
  ADD COLUMN `manPorCostes` DECIMAL(5,2) NULL AFTER `manPorImpClienteAgente`,
  ADD COLUMN `manCostes` BOOL NULL AFTER `manPorCostes`,
  ADD COLUMN `manJefeObra` BOOL NULL AFTER `manCostes`,
  ADD COLUMN `manOficinaTecnica` BOOL NULL AFTER `manJefeObra`,
  ADD COLUMN `manAsesorTecnico` BOOL NULL AFTER `manOficinaTecnica`,
  ADD COLUMN `manComercial` BOOL NULL AFTER `manAsesorTecnico`;
ALTER TABLE `proasistencia`.`contrato_comercial`   
  CHANGE `manPorImpCliente` `manPorImpCliente` DECIMAL(5,2) DEFAULT 0  NULL,
  CHANGE `manPorImpClienteAgente` `manPorImpClienteAgente` DECIMAL(5,2) DEFAULT 0  NULL,
  CHANGE `manPorCostes` `manPorCostes` DECIMAL(5,2) DEFAULT 0  NULL;
ALTER TABLE `proasistencia`.`prefacturas`   
  CHANGE `contratoMantenimientoId` `contratoClienteMantenimientoId` INT(11) NULL;  
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento`   
  ADD COLUMN `impComer` DECIMAL(10,2) NULL AFTER `referencia`;  
  