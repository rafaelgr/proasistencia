ALTER TABLE `prefacturas_lineas`   
  ADD COLUMN `coste` DECIMAL(12,2) NULL AFTER `totalLinea`,
  ADD COLUMN `porcentajeBeneficio` DECIMAL(5,2) NULL AFTER `coste`,
  ADD COLUMN `porcentajeAgente` DECIMAL(5,2) NULL AFTER `porcentajeBeneficio`;
