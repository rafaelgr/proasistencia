ALTER TABLE `clientes`   
  ADD COLUMN `emailFacturas` VARCHAR(255) NULL AFTER `limiteCredito`;
  
UPDATE clientes SET `emailFacturas` = `email`;