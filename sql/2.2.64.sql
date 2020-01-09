ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `proveedorId` INT(11) NULL AFTER `capituloLinea`,
  ADD COLUMN `importeProveedor` DECIMAL(10,2) NULL AFTER `proveedorId`,
  ADD COLUMN `totalLineaProveedor` DECIMAL(12,2) NULL AFTER `importeProveedor`,
  ADD COLUMN `tipoIvaProveedorId` INT(11) NULL AFTER `totalLineaProveedor`;

  ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `costeLineaProveedor` DECIMAL(12,2) NULL AFTER `totalLineaProveedor`;


ALTER TABLE `partes`   
  ADD COLUMN `ofertaId` INT(11) NULL AFTER `ano`,
  ADD CONSTRAINT `ref_parte_oferta` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas`(`ofertaId`);

  ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `porcentajeProveedor` DECIMAL(5,2) NULL AFTER `tipoIvaProveedorId`;

  ALTER TABLE `ofertas`   
  ADD COLUMN `servicioId` INT(11) NULL AFTER `contratoId`,
  ADD CONSTRAINT `of_servicio` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`servicioId`) ON DELETE NO ACTION;



