ALTER TABLE `partes`   
  ADD COLUMN `FactPropiaCli` TINYINT(1) DEFAULT 0 NULL AFTER `formaPagoClienteId`,
  ADD COLUMN `FactPropiaPro` TINYINT(1) DEFAULT 0 NULL AFTER `formaPagoProfesionalId`;

  ALTER TABLE `partes`   
  ADD COLUMN `facturaId` INT(11) NULL AFTER `enviar_otro_profesional`,
 
 ALTER TABLE `partes`   
  DROP COLUMN `enviar_otro_profesional`;



