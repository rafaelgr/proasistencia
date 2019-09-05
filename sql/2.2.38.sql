ALTER TABLE `tarifas_cliente_lineas` DROP FOREIGN KEY `ref_tarifa_cliente_articulo`;

ALTER TABLE `tarifas_cliente_lineas` ADD CONSTRAINT `ref_tarifa_cliente_articulo` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`articuloId`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `tarifas_proveedor_lineas` DROP FOREIGN KEY `ref_tarifa_proveedor_articulo`;

ALTER TABLE `tarifas_proveedor_lineas` ADD CONSTRAINT `ref_tarifa_proveedor_articulo` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`articuloId`) ON UPDATE CASCADE ON DELETE CASCADE;
