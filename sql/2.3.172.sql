ALTER TABLE `contrato_comercial`   
  ADD COLUMN `manPagoAcuenta` TINYINT(1) DEFAULT 0 NULL AFTER `comision`,
  ADD COLUMN `manPorPagoAcuenta` DECIMAL(5,2) DEFAULT 0 NULL AFTER `manPagoAcuenta`,
  ADD COLUMN `segPagoAcuenta` TINYINT(1) DEFAULT 0 NULL AFTER `segComercial`,
  ADD COLUMN `segPorPagoAcuenta` DECIMAL(5,2) DEFAULT 0 NULL AFTER `segPagoAcuenta`,
  ADD COLUMN `finPagoAcuenta` TINYINT(1) DEFAULT 0 NULL AFTER `finComercial`,
  ADD COLUMN `finPorPagoAcuenta` DECIMAL(5,2) DEFAULT 0 NULL AFTER `finPagoAcuenta`,
  ADD COLUMN `arqPagoAcuenta` TINYINT(1) DEFAULT 0 NULL AFTER `arqComercial`,
  ADD COLUMN `arqPorPagoAcuenta` DECIMAL(5,2) DEFAULT 0 NULL AFTER `arqPagoAcuenta`,
  ADD COLUMN `repPagoAcuenta` TINYINT(1) DEFAULT 0 NULL AFTER `repComercial`,
  ADD COLUMN `repPorPagoAcuenta` DECIMAL(5,2) NULL AFTER `repPagoAcuenta`,
  ADD COLUMN `obrPagoAcuenta` TINYINT(1) DEFAULT 0 NULL AFTER `obrComercial`,
  ADD COLUMN `obrPorPagoAcuenta` DECIMAL(5,2) DEFAULT 0 NULL AFTER `obrPagoAcuenta`;

ALTER TABLE `antprove`   
  ADD COLUMN `tipoComercialId` INT(11) NULL AFTER `esColaborador`,
  ADD CONSTRAINT `proveedor_tipoColaboradorFK` FOREIGN KEY (`tipoComercialId`) REFERENCES `tipos_comerciales`(`tipoComercialId`);

  ALTER TABLE `antprove`   
  ADD COLUMN `tipoComercialNombre` VARCHAR(255) NULL AFTER `tipoComercialId`;
