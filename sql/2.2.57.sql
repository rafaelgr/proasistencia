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


CREATE TABLE `facprove_antproves`(  
  `facproveAntproveId` INT(11) NOT NULL AUTO_INCREMENT,
  `facproveId` INT,
  `antproveId` INT(11),
  PRIMARY KEY (`facproveAntproveId`),
  CONSTRAINT `facAnt_facprove` FOREIGN KEY (`facproveId`) REFERENCES `facprove`(`facproveId`),
  CONSTRAINT `facAnt_antprove` FOREIGN KEY (`antproveId`) REFERENCES `antprove`(`antproveId`)
);

  