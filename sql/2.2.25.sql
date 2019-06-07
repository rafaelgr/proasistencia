ALTER TABLE `facturas`   
  ADD COLUMN `noCalculadora` TINYINT(1) DEFAULT 0 NULL AFTER `departamentoId`;

  UPDATE partes SET `forma_pago_cliente` = NULL;

  ALTER TABLE `partes`   
  CHANGE `forma_pago_cliente` `forma_pago_cliente` INT(11) NULL;

  ALTER TABLE `partes`   
  ADD COLUMN `formaPagoProfesionalId` INT(11) NULL AFTER `fecha_pago_profesional`;


ALTER TABLE `partes`   
  CHANGE `forma_pago_cliente` `formaPagoClienteId` INT(11) NULL;
