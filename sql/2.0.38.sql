ALTER TABLE `contrato_comercial`   
  ADD COLUMN `finComisAgente` BOOL DEFAULT FALSE NULL AFTER `segComision`,
  ADD COLUMN `finPorImpClilente` DECIMAL(5,2) NULL AFTER `finComisAgente`,
  ADD COLUMN `finPorImpClienteAgente` DECIMAL(5,2) NULL AFTER `finPorImpClilente`,
  ADD COLUMN `finPorCostes` DECIMAL(5,2) NULL AFTER `finPorImpClienteAgente`,
  ADD COLUMN `finCostes` BOOL DEFAULT FALSE NULL AFTER `finPorCostes`,
  ADD COLUMN `finJefeObra` BOOL DEFAULT FALSE NULL AFTER `finCostes`,
  ADD COLUMN `finOficinaTecnica` BOOL DEFAULT FALSE NULL AFTER `finJefeObra`,
  ADD COLUMN `finAsesorTecnico` BOOL DEFAULT FALSE NULL AFTER `finOficinaTecnica`,
  ADD COLUMN `finComercial` BOOL DEFAULT FALSE NULL AFTER `finAsesorTecnico`,
  ADD COLUMN `finComision` DECIMAL(5,2) NULL AFTER `finComercial`;

ALTER TABLE `contrato_comercial`   
  CHANGE `finPorImpClilente` `finPorImpClilente` DECIMAL(5,2) DEFAULT 0 NULL,
  CHANGE `finPorImpClienteAgente` `finPorImpClienteAgente` DECIMAL(5,2) DEFAULT 0 NULL,
  CHANGE `finPorCostes` `finPorCostes` DECIMAL(5,2) DEFAULT 0 NULL,
  CHANGE `finComision` `finComision` DECIMAL(5,2) DEFAULT 0 NULL;

ALTER TABLE `contrato_comercial`   
  CHANGE `finPorImpClilente` `finPorImpCliente` DECIMAL(5,2) DEFAULT 0.00 NULL;
