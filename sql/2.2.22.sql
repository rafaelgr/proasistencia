ALTER TABLE `proveedores`   
  ADD COLUMN `serie` VARCHAR(255) NULL AFTER `tarifaId`;

  ALTER TABLE `empresas`   
  ADD COLUMN `serieFacRep` VARCHAR(255) NULL AFTER `passCorreo`;

  ALTER TABLE `partes_lineas`   
  ADD COLUMN `iva` DECIMAL(12,2) NULL AFTER `codigoArticulo`;


ALTER TABLE `partes_lineas`   
  ADD COLUMN `importeProveedorIva` DECIMAL(12,2) NULL AFTER `importeCliente`,
  ADD COLUMN `importeClienteIva` DECIMAL(12,2) NULL AFTER `importeProveedorIva`;

ALTER TABLE `partes`   
  ADD COLUMN `importe_cliente_iva` DECIMAL(12,2) NULL AFTER `importe_cliente`,
  ADD COLUMN `importe_profesional_iva` DECIMAL(12,2) NULL AFTER `importe_profesional`;


ALTER TABLE `partes_lineas`   
  ADD COLUMN `tipoIvaId` INT(11) NULL AFTER `codigoArticulo`;

  ALTER TABLE `partes_lineas`  
  ADD CONSTRAINT `lineParte_tipoIvaFK` FOREIGN KEY (`tipoIvaId`) REFERENCES `proasistencia`.`tipos_iva`(`tipoIvaId`) ON UPDATE CASCADE ON DELETE NO ACTION;

  ALTER TABLE `partes_lineas`   
  ADD COLUMN `comentarios` VARCHAR(255) NULL AFTER `importeClienteIva`;



