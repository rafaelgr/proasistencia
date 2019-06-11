ALTER TABLE `facturas`   
  ADD COLUMN `noCalculadora` TINYINT(1) DEFAULT 0 NULL AFTER `departamentoId`;

  UPDATE partes SET `forma_pago_cliente` = NULL;

  ALTER TABLE `partes`   
  CHANGE `forma_pago_cliente` `forma_pago_cliente` INT(11) NULL;

  ALTER TABLE `partes`   
  ADD COLUMN `formaPagoProfesionalId` INT(11) NULL AFTER `fecha_pago_profesional`;


ALTER TABLE `partes`   
  CHANGE `forma_pago_cliente` `formaPagoClienteId` INT(11) NULL;

  ALTER TABLE `partes_lineas`   
  ADD COLUMN `tipoIvaClienteId` INT(11) NULL AFTER `comentarios`;

  ALTER TABLE `partes_lineas`   
  DROP INDEX `lineParte_tipoIvaFK`;

  ALTER TABLE `partes_lineas`   
  DROP INDEX `lineParte_tipoIvaFK`,
  DROP FOREIGN KEY `lineParte_tipoIvaFK`;

  ALTER TABLE `partes_lineas`  
  ADD CONSTRAINT `lineas_parte_tipoaIvaClienteFK` FOREIGN KEY (`tipoIvaClienteId`) REFERENCES `tipos_iva`(`tipoIvaId`) ON UPDATE CASCADE ON DELETE NO ACTION;

  ALTER TABLE `partes_lineas`   
  CHANGE `tipoIvaId` `tipoIvaProveedorId` INT(11) NULL;

  ALTER TABLE `partes_lineas`   
  CHANGE `tipoIvaId` `tipoIvaProveedorId` INT(11) NULL,
  ADD CONSTRAINT `lineas_parte_tipoaIvaProveedorFK` FOREIGN KEY (`tipoIvaProveedorId`) REFERENCES `tipos_iva`(`tipoIvaId`) ON UPDATE CASCADE ON DELETE NO ACTION;

  ALTER TABLE `partes_lineas`   
  CHANGE `iva` `ivaCliente` DECIMAL(12,2) NULL;

  ALTER TABLE `partes_lineas`   
  ADD COLUMN `ivaProveedor` DECIMAL(12,2) NULL AFTER `tipoIvaClienteId`;

  ALTER TABLE `partes_lineas`   
  ADD COLUMN `aCuentaCliente` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `ivaProveedor`,
  ADD COLUMN `aCuentaProveedor` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `aCuentaCliente`;

  ALTER TABLE `partes_lineas`   
  ADD COLUMN `totalClienteIva` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `aCuentaProveedor`;

  ALTER TABLE `partes_lineas`   
  ADD COLUMN `totalProveedorIva` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `totalClienteIva`;

  ALTER TABLE `partes_lineas`  
  ADD CONSTRAINT `lineas_parte_tipoaIvaProveedorFK` FOREIGN KEY (`tipoIvaProveedorId`) REFERENCES `tipos_iva`(`tipoIvaId`) ON UPDATE CASCADE ON DELETE NO ACTION;












