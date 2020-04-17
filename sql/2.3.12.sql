
ALTER TABLE `contratos`   
  ADD COLUMN `servicioId` INT(11) NULL AFTER `sel`;

  ALTER TABLE `partes_lineas`   
  CHANGE `unidades` `unidades` DECIMAL(12,2) NULL;

