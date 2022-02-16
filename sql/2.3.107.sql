ALTER TABLE `proveedores`   
  DROP COLUMN `login`, 
  DROP COLUMN `password`, 
  DROP COLUMN `playerId`;


  ALTER TABLE `partes`   
  ADD COLUMN `notasWeb` VARCHAR(255) NULL AFTER `pdf`;

  ALTER TABLE `partes`   
  CHANGE `notasWeb` `notasWeb` TEXT CHARSET utf8 COLLATE utf8_general_ci NULL;


