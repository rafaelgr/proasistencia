ALTER TABLE `partes`   
  ADD COLUMN `prefacturaId` INT(11) NULL AFTER `facturaId`;

ALTER TABLE `prefacturas`   
  ADD COLUMN `noCalculadora` TINYINT(1) DEFAULT 0 NULL AFTER `departamentoId`;
