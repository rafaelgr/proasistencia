ALTER TABLE `clientes`   
  ADD COLUMN `emailFacturas` VARCHAR(255) NULL AFTER `limiteCredito`;
  
UPDATE clientes SET `emailFacturas` = `email`;

LTER TABLE `proveedores`   
  CHANGE `fianzaAcumulada` `fianzaAcumulada` DECIMAL(10,2) DEFAULT 0 NULL,
  CHANGE `retencionFianza` `retencionFianza` DECIMAL(10,2) DEFAULT 0 NULL;
