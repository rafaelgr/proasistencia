ALTER TABLE `proveedores`   
  ADD COLUMN `codigoRetencion` SMALLINT(11) DEFAULT 0 NULL AFTER `serie`;
ALTER TABLE `proveedores`   
  ADD COLUMN `observaciones` TEXT NULL AFTER `codigoRetencion`;

  ALTER TABLE `proveedores`   
  ADD COLUMN `departamentoId` INT(11) NULL AFTER `serie`,
  ADD CONSTRAINT `proveedores_departamentos` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`) ON UPDATE CASCADE;

ALTER TABLE `proveedores`   
  ADD COLUMN `fianzaAcumulada` DECIMAL(10,2) NULL AFTER `fianza`,
  ADD COLUMN `revisionFianza` DATE NULL AFTER `fianzaAcumulada`,
  ADD COLUMN `retencionFianza` DECIMAL(10,2) NULL AFTER `revisionFianza`;
