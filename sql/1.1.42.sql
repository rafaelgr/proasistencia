ALTER TABLE `facturas`   
  ADD COLUMN `generada` BOOL DEFAULT FALSE NULL AFTER `coste`,
  ADD COLUMN `porcentajeBeneficio` DECIMAL(5,2) NULL AFTER `generada`,
  ADD COLUMN `porcentajeAgente` DECIMAL(5,2) NULL AFTER `porcentajeBeneficio`;