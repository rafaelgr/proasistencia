ALTER TABLE `contratos`   
  ADD COLUMN `obsFactura` TEXT NULL AFTER `antContratoId`;
ALTER TABLE `prefacturas`   
  ADD COLUMN `obsFactura` TEXT NULL AFTER `periodo`;  
ALTER TABLE `facturas`   
  ADD COLUMN `obsFactura` TEXT NULL AFTER `periodo`;  