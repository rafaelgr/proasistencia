ALTER TABLE `proasistencia`.`tarifas_cliente_lineas` DROP FOREIGN KEY `ref_tarifa_cliente_articulo`;

ALTER TABLE `proasistencia`.`tarifas_cliente_lineas` ADD CONSTRAINT `ref_tarifa_cliente_articulo` FOREIGN KEY (`articuloId`) REFERENCES `proasistencia`.`articulos`(`articuloId`) ON UPDATE CASCADE ON DELETE CASCADE;
