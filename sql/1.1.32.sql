ALTER TABLE `prefacturas`   
  ADD COLUMN `totalAlCliente` DECIMAL(12,2) NULL AFTER `facturaId`,
  ADD COLUMN `costeProporcional` DECIMAL(12,2) NULL AFTER `totaAlCliente`;

ALTER TABLE `facturas`   
  ADD COLUMN `totalAlCliente` DECIMAL(12,2) NULL AFTER `facturaId`,
  ADD COLUMN `costeProporcional` DECIMAL(12,2) NULL AFTER `totaAlCliente`;  