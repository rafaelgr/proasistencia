INSERT INTO tipos_mantenimiento (tipoMantenimientoId, nombre) VALUES (5, 'ARQUITECTURA');

ALTER TABLE `contrato_comercial`   
  ADD COLUMN `arqComisAgente` TINYINT(1) DEFAULT 0 NULL AFTER `finComision`,
  ADD COLUMN `arqPorImpCliente` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `arqComisAgente`,
  ADD COLUMN `arqPorImpClienteAgente` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `arqPorImpCliente`,
  ADD COLUMN `arqPorCostes` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `arqPorImpClienteAgente`,
  ADD COLUMN `arqCostes` TINYINT(1) DEFAULT 0 NULL AFTER `arqPorCostes`,
  ADD COLUMN `arqJefeObra` TINYINT(1) DEFAULT 0 NULL AFTER `arqCostes`,
  ADD COLUMN `arqOficinaTecnica` TINYINT(1) DEFAULT 0 NULL AFTER `arqJefeObra`,
  ADD COLUMN `arqAsesorTecnico` TINYINT(1) DEFAULT 0 NULL AFTER `arqOficinaTecnica`,
  ADD COLUMN `arqComercial` TINYINT(1) DEFAULT 0 NULL AFTER `arqAsesorTecnico`,
  ADD COLUMN `arqComision` DECIMAL(5,2) DEFAULT 0.00 NULL AFTER `arqComercial`;
