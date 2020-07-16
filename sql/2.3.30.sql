ALTER TABLE `partes`   
  ADD COLUMN `fichero` VARCHAR(255) NULL AFTER `fecha_cierre_profesional`;

ALTER TABLE `parametros`   
  ADD COLUMN `bucket` VARCHAR(255) NULL AFTER `cuentaretencion`,
  ADD COLUMN `bucket_region` VARCHAR(255) NULL AFTER `bucket`,
  ADD COLUMN `bucket_folder` VARCHAR(255) NULL AFTER `bucket_region`,
  ADD COLUMN `identity_pool` VARCHAR(255) NULL AFTER `bucket_folder`;
  ADD COLUMN `raiz_url` VARCHAR(255) NULL AFTER `indentity_pool`;

 


ALTER TABLE `contrato_comercial`   
  ADD COLUMN `repComisAgente` TINYINT(1) DEFAULT 0 NULL AFTER `arqComision`,
  ADD COLUMN `repPorImpCliente` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `repComisAgente`,
  ADD COLUMN `repPorImpClienteAgente` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `repPorImpCliente`,
  ADD COLUMN `repPorCostes` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `repPorImpClienteAgente`,
  ADD COLUMN `repCostes` TINYINT(1) DEFAULT 0 NULL AFTER `repPorCostes`,
  ADD COLUMN `repJefeObra` TINYINT(1) DEFAULT 0 NULL AFTER `repCostes`,
  ADD COLUMN `repOficinaTecnica` TINYINT(1) DEFAULT 0 NULL AFTER `repJefeObra`,
  ADD COLUMN `repAsesorTecnico` TINYINT(1) DEFAULT 0 NULL AFTER `repOficinaTecnica`,
  ADD COLUMN `repComercial` TINYINT(1) DEFAULT 0 NULL AFTER `repAsesorTecnico`,
  ADD COLUMN `repComision` TINYINT(1) DEFAULT 0 NULL AFTER `repComercial`,
  ADD COLUMN `obrComisAgente` TINYINT(1) DEFAULT 0 NULL AFTER `repComision`,
  ADD COLUMN `obrPorImpCliente` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `obrComisAgente`,
  ADD COLUMN `obrPorImpClienteAgente` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `obrPorImpCliente`,
  ADD COLUMN `obrPorCostes` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `obrPorImpClienteAgente`,
  ADD COLUMN `obrCostes` TINYINT(1) DEFAULT 0 NULL AFTER `obrPorCostes`,
  ADD COLUMN `obrJefeObra` TINYINT(1) DEFAULT 0 NULL AFTER `obrCostes`,
  ADD COLUMN `obrOficinaTecnica` TINYINT(1) DEFAULT 0 NULL AFTER `obrJefeObra`,
  ADD COLUMN `obrAsesorTecnico` TINYINT(1) DEFAULT 0 NULL AFTER `obrOficinaTecnica`,
  ADD COLUMN `obrComercial` TINYINT(1) DEFAULT 0 NULL AFTER `obrAsesorTecnico`,
  ADD COLUMN `obrComision` TINYINT(1) DEFAULT 0 NULL AFTER `obrComercial`;
