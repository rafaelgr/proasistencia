ALTER TABLE `proasistencia`.`clientes_comisionistas`   
  ADD COLUMN `porComer` DECIMAL(5,2) NULL AFTER `manPorBeneficio`;
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento_comisionistas`   
  ADD COLUMN `porComer` DECIMAL(5,2) NULL AFTER `porBeneficio`;
  