ALTER TABLE `facprove`   
  ADD COLUMN `esColaborador` TINYINT(1) DEFAULT 0 NULL AFTER `enviadaCorreo`;

ALTER TABLE `antprove` ADD COLUMN `esColaborador` TINYINT(1) DEFAULT 0 NULL AFTER `servicioId`; 

