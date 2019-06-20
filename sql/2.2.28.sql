ALTER TABLE `partes`   
  ADD COLUMN `FactPropiaCli` TINYINT(1) DEFAULT 0 NULL AFTER `formaPagoClienteId`,
  ADD COLUMN `FactPropiaPro` TINYINT(1) DEFAULT 0 NULL AFTER `formaPagoProfesionalId`;

  ALTER TABLE `partes`   
  ADD COLUMN `facturaId` INT(11) NULL AFTER `enviar_otro_profesional`,
  ADD CONSTRAINT `ref_parte_factura` FOREIGN KEY (`facturaId`) REFERENCES `proasistencia`.`facturas`(`facturaId`);

