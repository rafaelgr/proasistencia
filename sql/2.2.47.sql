ALTER TABLE `facturas`   
  ADD COLUMN `aCuenta` DECIMAL(12,2) NULL AFTER `noCalculadora`;
ALTER TABLE  `partes`   
  ADD COLUMN `aCuentaProfesional` DECIMAL(12,2) NULL AFTER `formaPagoClienteId`,
  ADD COLUMN `aCuentaCli` DECIMAL(12,2) NULL AFTER `formaPagoProfesionalId`;

  ALTER TABLE `partes`   
  CHANGE `aCuentaProfesional` `aCuentaProfesional` DECIMAL(12,2) DEFAULT 0 NULL,
  CHANGE `aCuentaCli` `aCuentaCliente` DECIMAL(12,2) DEFAULT 0 NULL;

ALTER TABLE `facturas`   
  CHANGE `aCuenta` `aCuenta` DECIMAL(12,2) DEFAULT 0 NULL,
  ADD COLUMN `totalSinAcuenta` DECIMAL(12,2) DEFAULT 0 NULL AFTER `aCuenta`;

