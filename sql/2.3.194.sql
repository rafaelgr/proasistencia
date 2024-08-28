ALTER TABLE `contratos`   
  ADD COLUMN `fechaRenovacionIpc` DATE NULL AFTER `beneficioLineal`,
  ADD COLUMN `ipc` DECIMAL(12,2) DEFAULT 0 NULL AFTER `fechaRenovacionIpc`;
  ADD COLUMN `renovar` TINYINT(1) DEFAULT 0 NULL AFTER `ipc`;