ALTER TABLE `partes`   
  ADD COLUMN `numero` INT(11) NULL AFTER `facturaId`;
 
 LTER TABLE `partes`   
  ADD COLUMN `ano` VARCHAR(255) NULL AFTER `numero`;

  UPDATE partes set ano = '2019'