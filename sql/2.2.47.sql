ALTER TABLE `facturas`   
  ADD COLUMN `aCuenta` DECIMAL(12,2) DEFAULT 0 NULL AFTER `noCalculadora`;

  ALTER TABLE `facturas`   
  ADD COLUMN `totalSinAcuenta` DECIMAL(12,2) DEFAULT 0 NULL AFTER `aCuenta`;

  ALTER TABLE `facprove`   
  ADD COLUMN `aCuenta` DECIMAL(12,2) DEFAULT 0 NULL AFTER `fianza`;

  ALTER TABLE `facprove`   
  ADD COLUMN `totalSinAcuenta` DECIMAL(12,2) DEFAULT 0 NULL AFTER `aCuenta`;

ALTER TABLE  `partes`   
  ADD COLUMN `aCuentaProfesional` DECIMAL(12,2) NULL AFTER `formaPagoClienteId`,
  ADD COLUMN `aCuentaCli` DECIMAL(12,2) NULL AFTER `formaPagoProfesionalId`;

  ALTER TABLE `partes`   
  CHANGE `aCuentaProfesional` `aCuentaProfesional` DECIMAL(12,2) DEFAULT 0 NULL,
  CHANGE `aCuentaCli` `aCuentaCliente` DECIMAL(12,2) DEFAULT 0 NULL;


  ALTER TABLE `empresas`   
  ADD COLUMN `infFacCliRep` VARCHAR(255) NULL AFTER `infPreFacturas`;


UPDATE empresas SET infFacCliRep = 'factcli_reparaciones_proas' WHERE empresaId = 2;
UPDATE empresas SET infFacCliRep = 'factcli_reparaciones_fondo' WHERE empresaId = 3;
UPDATE empresas SET infFacCliRep = 'factcli_reparaciones_sierra' WHERE empresaId = 6;
UPDATE empresas SET infFacCliRep = 'factcli_reparaciones_reabita' WHERE empresaId = 7;