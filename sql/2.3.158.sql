ALTER TABLE `ofertas`   
  ADD COLUMN `beneficioLineal` TINYINT(1) DEFAULT 0 NULL AFTER `servicioId`;

  ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `importeBeneficio` DECIMAL(12,2) NULL AFTER `porcentajeBeneficio`;

  ALTER TABLE `ofertas_lineas` 
  ADD COLUMN `ventaNeta` DECIMAL(12,2) NULL AFTER `porcentajeAgente`; 


  ALTER TABLE `ofertas_lineas`   
  CHANGE `importeBeneficio` `importeBeneficio` DECIMAL(12,2) DEFAULT 0 NULL,
  CHANGE `ventaNeta` `ventaNeta` DECIMAL(12,2) DEFAULT 0 NULL;


ALTER TABLE `ofertas_lineas`   
  CHANGE `importeBeneficio` `importeBeneficioLinea` DECIMAL(12,2) DEFAULT 0.00 NULL,
  CHANGE `ventaNeta` `ventaNetaLinea` DECIMAL(12,2) DEFAULT 0.00 NULL;


