ALTER TABLE `contratos`   
  ADD COLUMN `ascContratoId` INT(11) NULL COMMENT 'código del contrato asociado' AFTER `antContratoId`;
