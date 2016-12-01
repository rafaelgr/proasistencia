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