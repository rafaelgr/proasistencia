ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `perdtoProveedor` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `perdto`;


UPDATE ofertas_lineas SET perdtoProveedor = perdto;

ALTER TABLE `antprove`   
  ADD COLUMN `servicioId` INT(11) NULL AFTER `completo`,
  ADD CONSTRAINT `antprove_servicio` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`servicioId`);


  ALTER TABLE `antclien`   
  ADD COLUMN `servicioId` INT(11) NULL AFTER `parteLineaId`,
  ADD CONSTRAINT `antclien_servicio` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`servicioId`);

  ALTER TABLE `proveedores`   
  ADD COLUMN `emitirFacturas` TINYINT(1) DEFAULT 1 NULL AFTER `paisId`;

ALTER TABLE `facprove`   
  ADD COLUMN `numeroFacturaProveedor2` VARCHAR(255) NULL AFTER `numeroFacturaProveedor`,
  ADD COLUMN `fecha_recepcion2` DATE NULL AFTER `fecha_recepcion`;

