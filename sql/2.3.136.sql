ALTER TABLE `contratos`   
  ADD COLUMN `porRetenGarantias` DECIMAL(4,2) DEFAULT 0 NULL AFTER `contratoIntereses`;

  ALTER TABLE `prefacturas`   
  ADD COLUMN `retenGarantias` DECIMAL(4,2) DEFAULT 0 NULL AFTER `importeRetencion`;

    ALTER TABLE `facturas`   
  ADD COLUMN `retenGarantias` DECIMAL(4,2) DEFAULT 0 NULL AFTER `importeRetencion`;

  ALTER TABLE `prefacturas`   
  ADD COLUMN `restoCobrar` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `totalAlCliente`;

  UPDATE prefacturas SET restoCobrar = totalConIva;
