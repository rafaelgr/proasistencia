ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `loginWeb` VARCHAR(255) NULL AFTER `emailFacturas`,
  ADD COLUMN `passWeb` VARCHAR(255) NULL AFTER `loginWeb`;
