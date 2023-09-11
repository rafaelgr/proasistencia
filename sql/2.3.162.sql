ALTER TABLE `proveedores`   
  ADD COLUMN `cerTitularidad` TINYINT(1) DEFAULT 0 NULL AFTER `emitirFacturas`;

  ALTER TABLE `documentacion` ADD COLUMN `proveedorId` INT(11) NULL AFTER `carpetaId`; 

  ALTER TABLE `proveedores`   
  ADD COLUMN `cerFormativoSalud` TINYINT(1)  DEFAULT 0 NULL AFTER `tipoViaRepresentanteId`;
