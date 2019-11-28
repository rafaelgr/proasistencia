ALTER TABLE `antprove`   
  ADD COLUMN `conceptoAnticipo` VARCHAR(255) NULL AFTER `departamentoId`;

ALTER TABLE `antprove`   
  ADD COLUMN `completo` TINYINT(1) DEFAULT 0 NULL AFTER `conceptoAnticipo`;  
  
  UPDATE antprove SET completo = 1;
  

  ALTER TABLE `facprove`   
  ADD COLUMN `conceptoAnticipo` VARCHAR(255) NULL AFTER `totalSinAcuenta`;

  ALTER TABLE `facprove`   
  CHANGE `totalSinAcuenta` `restoPagar` DECIMAL(12,2) DEFAULT 0.00 NULL;

  ALTER TABLE `facprove`   
  CHANGE `aCuenta` `importeAnticipo` DECIMAL(12,2) DEFAULT 0.00 NULL;



  