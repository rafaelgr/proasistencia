ALTER TABLE `contratos`   
  DROP COLUMN `porRetenGarantias`;
  
  ALTER TABLE `contrato_planificacion`   
  ADD COLUMN `porRetenGarantias` DECIMAL(4,2) DEFAULT 0 NULL AFTER `porcentaje`;

  ALTER TABLE `prefacturas`   
  CHANGE `retenGarantias` `retenGarantias` DECIMAL(12,2) DEFAULT 0.00 NULL;

    ALTER TABLE `facturas`   
  CHANGE `retenGarantias` `retenGarantias` DECIMAL(12,2) DEFAULT 0.00 NULL;
