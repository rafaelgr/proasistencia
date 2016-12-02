CREATE TABLE `tipos_mantenimiento`(  
  `tipoMantenimientoId` INT(11) NOT NULL,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tipoMantenimientoId`)
);


ALTER TABLE .`contrato_cliente_mantenimiento`   
  ADD COLUMN `tipoMantenimientoId` INT(11) NULL AFTER `facturaParcial`,
  ADD CONSTRAINT `ref_ccm_tipomantenimiento` FOREIGN KEY (`tipoMantenimientoId`) REFERENCES .`tipos_mantenimiento`(`tipoMantenimientoId`);

# Crear los tipos por defecto
DELETE FROM tipos_mantenimiento;
INSERT INTO tipos_mantenimiento VALUES(1, 'MANTENIMIENTO');
INSERT INTO tipos_mantenimiento VALUES(2, 'SEGUROS');
# Los contratos por defecto que sean de mantenimiento 
UPDATE contrato_cliente_mantenimiento SET tipoMantenimientoId = 1;

# parámetros para seguros en el contrato
ALTER TABLE `proasistencia`.`contrato_comercial`   
  ADD COLUMN `manComision` DECIMAL(5,2) NULL AFTER `comision`,
  ADD COLUMN `segComisAgente` BOOL DEFAULT FALSE NULL AFTER `manComision`,
  ADD COLUMN `segPorImpCliente` DECIMAL(5,2) NULL AFTER `segComisAgente`,
  ADD COLUMN `segPorImpClienteAgente` DECIMAL(5,2) NULL AFTER `segPorImpCliente`,
  ADD COLUMN `segPorCostes` DECIMAL(5,2) NULL AFTER `segPorImpClienteAgente`,
  ADD COLUMN `segCostes` BOOL DEFAULT FALSE NULL AFTER `segPorCostes`,
  ADD COLUMN `segJefeObra` BOOL DEFAULT FALSE NULL AFTER `segCostes`,
  ADD COLUMN `segOficinaTecnica` BOOL DEFAULT FALSE NULL AFTER `segJefeObra`,
  ADD COLUMN `segAsesorTecnico` BOOL DEFAULT FALSE NULL AFTER `segOficinaTecnica`,
  ADD COLUMN `segComercial` BOOL DEFAULT FALSE NULL AFTER `segAsesorTecnico`,
  ADD COLUMN `segComision` DECIMAL(5,2) NULL AFTER `segComercial`;

ALTER TABLE `proasistencia`.`contrato_comercial`   
  CHANGE `manComision` `manComision` DECIMAL(5,2) DEFAULT 0.00 NULL,
  CHANGE `segPorImpCliente` `segPorImpCliente` DECIMAL(5,2) DEFAULT 0.00 NULL,
  CHANGE `segPorImpClienteAgente` `segPorImpClienteAgente` DECIMAL(5,2) DEFAULT 0.00 NULL,
  CHANGE `segPorCostes` `segPorCostes` DECIMAL(5,2) DEFAULT 0.00 NULL,
  CHANGE `segComision` `segComision` DECIMAL(5,2) DEFAULT 0.00 NULL;