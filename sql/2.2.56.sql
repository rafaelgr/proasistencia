ALTER TABLE `antprove`   
  ADD COLUMN `conceptoAnticipo` VARCHAR(255) NULL AFTER `departamentoId`;

ALTER TABLE `antprove`   
  ADD COLUMN `completo` TINYINT(1) DEFAULT 0 NULL AFTER `conceptoAnticipo`;