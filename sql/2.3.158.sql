ALTER TABLE `ofertas`   
  ADD COLUMN `beneficioLineal` TINYINT(1) DEFAULT 0 NULL AFTER `servicioId`;

  ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `importeBeneficio` DECIMAL(12,2) DEFAULT 0.00 AFTER `porcentajeBeneficio`;

  ALTER TABLE `ofertas_lineas` 
  ADD COLUMN `ventaNeta` DECIMAL(12,2) DEFAULT 0.00 AFTER `porcentajeAgente`; 



ALTER TABLE `ofertas_lineas`   
  CHANGE `importeBeneficio` `importeBeneficioLinea` DECIMAL(12,2) DEFAULT 0.00 NULL,
  CHANGE `ventaNeta` `ventaNetaLinea` DECIMAL(12,2) DEFAULT 0.00 NULL;

  ALTER TABLE `ofertas_lineas`   
  ADD COLUMN `importeAgenteLinea` DECIMAL(12,2) DEFAULT 0 NULL AFTER `porcentajeAgente`;


  ALTER TABLE `contratos`   
  ADD COLUMN `beneficioLineal` TINYINT(1) DEFAULT 0 NULL AFTER `externo`;

   ALTER TABLE `contratos_lineas`   
  ADD COLUMN `importeBeneficio` DECIMAL(12,2) DEFAULT 0.00 AFTER `porcentajeBeneficio`;

  ALTER TABLE `contratos_lineas` 
  ADD COLUMN `ventaNeta` DECIMAL(12,2) DEFAULT 0.00 AFTER `porcentajeAgente`; 



ALTER TABLE `contratos_lineas`   
  CHANGE `importeBeneficio` `importeBeneficioLinea` DECIMAL(12,2) DEFAULT 0.00 NULL,
  CHANGE `ventaNeta` `ventaNetaLinea` DECIMAL(12,2) DEFAULT 0.00 NULL;

  ALTER TABLE `contratos_lineas`   
  ADD COLUMN `importeAgenteLinea` DECIMAL(12,2) DEFAULT 0 NULL AFTER `porcentajeAgente`;




