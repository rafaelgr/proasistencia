ALTER TABLE `tarifas_cliente_lineas` DROP FOREIGN KEY `ref_tarifa_cliente`;

ALTER TABLE `tarifas_cliente_lineas` ADD CONSTRAINT `ref_tarifa_cliente` FOREIGN KEY (`tarifaClienteId`) REFERENCES `tarifas_cliente`(`tarifaClienteId`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `tarifas_proveedor_lineas` DROP FOREIGN KEY `ref_tarifa_proveedor`;

ALTER TABLE `tarifas_proveedor_lineas` ADD CONSTRAINT `ref_tarifa_proveedor` FOREIGN KEY (`tarifaProveedorId`) REFERENCES `tarifas_proveedor`(`tarifaProveedorId`) ON UPDATE CASCADE ON DELETE CASCADE;
