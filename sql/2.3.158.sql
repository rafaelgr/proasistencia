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
  ADD COLUMN `importeAgenteLinea` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `porcentajeAgente`;


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
  CHANGE `importeAgenteLinea` `importeAgenteLinea` DECIMAL(12,2)   DEFAULT 0.00;

  ALTER TABLE `contratos_lineas`   
  ADD COLUMN `costeUnidad` DECIMAL(14,4) DEFAULT 0 NULL AFTER `totalLinea`;

   ALTER TABLE `ofertas_lineas` CHANGE `importe` `importe` DECIMAL(14,4) NULL; 

   //
   ALTER TABLE `prefacturas`   
  ADD COLUMN `beneficioLineal` TINYINT(1) DEFAULT 0 NULL AFTER `numLetra`;

  ALTER TABLE `prefacturas_lineas`   
  ADD COLUMN `importeBeneficioLinea` DECIMAL(12,2) DEFAULT 0.00 AFTER `porcentajeBeneficio`;

    ALTER TABLE `prefacturas_lineas`   
  ADD COLUMN `importeAgenteLinea` DECIMAL(12,2) DEFAULT 0.00 NULL AFTER `porcentajeAgente`;

  ALTER TABLE `prefacturas_lineas` 
  ADD COLUMN `ventaNetaLinea` DECIMAL(12,2) DEFAULT 0.00 AFTER `importeAgenteLinea`; 





