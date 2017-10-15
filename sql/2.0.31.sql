ALTER TABLE `prefacturas`   
  ADD COLUMN `mantenedorDesactivado` BOOL DEFAULT FALSE NULL AFTER `importeRetencion`;
ALTER TABLE `facturas`   
  ADD COLUMN `mantenedorDesactivado` BOOL DEFAULT FALSE NULL AFTER `importeRetencion`;  
