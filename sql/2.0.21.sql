ALTER TABLE `contratos`   
  ADD COLUMN `porcentajeRetencion` DECIMAL(4,2) NULL AFTER `tipoViaId`;
ALTER TABLE `prefacturas`   
  ADD COLUMN `porcentajeRetencion` DECIMAL(4,2) NULL AFTER `obsFactura`,
  ADD COLUMN `importeRetencion` DECIMAL(12,2) NULL AFTER `porcentajeRetencion`;
ALTER TABLE `facturas`   
  ADD COLUMN `porcentajeRetencion` DECIMAL(4,2) NULL AFTER `obsFactura`,
  ADD COLUMN `importeRetencion` DECIMAL(12,2) NULL AFTER `porcentajeRetencion`;  

UPDATE contratos SET porcentajeRetencion = 0;
UPDATE prefacturas SET porcentajeRetencion = 0, importeRetencion = 0;
UPDATE facturas SET porcentajeRetencion = 0, importeRetencion = 0