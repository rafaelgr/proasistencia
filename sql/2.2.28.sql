ALTER TABLE `partes`   
  ADD COLUMN `FactPropiaCli` TINYINT(1) DEFAULT 0 NULL AFTER `formaPagoClienteId`,
  ADD COLUMN `FactPropiaPro` TINYINT(1) DEFAULT 0 NULL AFTER `formaPagoProfesionalId`;
