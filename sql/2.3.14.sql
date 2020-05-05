ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `precio` DECIMAL(12,2) NULL AFTER `porcentajeProveedor`,
  ADD COLUMN `perdto` DECIMAL(12,2) DEFAULT 0 NULL AFTER `precio`,
  ADD COLUMN `dto` DECIMAL(12,2) DEFAULT 0 NULL AFTER `perdto`;


ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `precioProveedor` DECIMAL(12,2) NULL AFTER `dto`,
  ADD COLUMN `dtoProveedor` DECIMAL(12,2) DEFAULT 0 NULL AFTER `precioProveedor`;

  ALTER TABLE `contrato_porcentajes`   
  ADD COLUMN `importe` DECIMAL(12,2) NULL AFTER `fecha`,
  ADD COLUMN `formaPagoId` INT(11) NULL AFTER `importe`,
  ADD CONSTRAINT `formaPago_porcentajes` FOREIGN KEY (`formaPagoId`) REFERENCES `proasistencia`.`formas_pago`(`formaPagoId`);

  ALTER TABLE `prefacturas`   
  ADD COLUMN `contratoPorcenId` INT(11) NULL AFTER `observacionesPago`,
  ADD CONSTRAINT `pref_conceptoPorcen` FOREIGN KEY (`contratoPorcenId`) REFERENCES `contrato_porcentajes`(`contratoPorcenId`) ON DELETE CASCADE;
