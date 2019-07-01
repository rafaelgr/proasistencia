ALTER TABLE `partes`   
  ADD COLUMN `numero` INT(11) NULL AFTER `facturaId`;
 
 ALTER TABLE `partes`   
  ADD COLUMN `ano` VARCHAR(255) NULL AFTER `numero`;

  UPDATE partes set ano = '2019'

  ALTER TABLE `partes`   
  ADD COLUMN `facproveId` INT(11) NULL AFTER `facturaId`;
