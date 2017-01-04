ALTER TABLE `prefacturas_lineas`   
  CHANGE `linea` `linea` DECIMAL(6,3) NULL;
ALTER TABLE `facturas_lineas`   
  CHANGE `linea` `linea` DECIMAL(6,3) NULL;  

ALTER TABLE `prefacturas_lineas`   
  ADD COLUMN `capituloLinea` VARCHAR(255) NULL AFTER `porcentajeAgente`;
ALTER TABLE `facturas_lineas`   
  ADD COLUMN `capituloLinea` VARCHAR(255) NULL;
