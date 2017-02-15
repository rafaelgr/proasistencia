ALTER TABLE `contratos`   
  ADD COLUMN `antContratoId` INT(11) NULL COMMENT 'Código del anterior contrato, del que este es renovacion' AFTER `preaviso`;