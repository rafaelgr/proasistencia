# montar grupos de artículo
CREATE TABLE `proasistencia`.`grupo_articulo`(  
  `grupoArticuloId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`grupoArticuloId`)
);
# en artículo nueva descripcion y referencia a grupo
ALTER TABLE `proasistencia`.`articulos`   
  ADD COLUMN `grupoArticuloId` INT(11) NULL AFTER `articuloId`,
  ADD COLUMN `descripcion` TEXT NULL AFTER `tipoIvaId`,
  ADD CONSTRAINT `ref_art_grupo` FOREIGN KEY (`grupoArticuloId`) REFERENCES `proasistencia`.`grupo_articulo`(`grupoArticuloId`);
# cambio en denominaciones para reflejar los conceptos como columnas en la base de datos
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento`   
  CHANGE `importe` `venta` DECIMAL(10,2) NULL,
  CHANGE `importeInicial` `ventaNeta` DECIMAL(10,2) NULL,
  ADD COLUMN `importeAlCliente` DECIMAL(10,2) NULL AFTER `articuloId`;
# cambio en los contratos comerciales para tener las comisiones correctas
ALTER TABLE `proasistencia`.`contrato_comercial`   
  CHANGE `manImporteOperacion` `manPorVentaNeta` DECIMAL(5,2) NULL  COMMENT 'Porcentaje sobre venta neta',
  CHANGE `manPorVentas` `manPorBeneficio` DECIMAL(5,2) NULL  COMMENT 'Porcentaje sobre beneficio';
# el cambio anterior pero en la relación de coplaboradores en un contrato de mantenimento
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento_comisionistas`   
  CHANGE `porComer` `porVentaNeta` DECIMAL(5,2) NULL,
  ADD COLUMN `porBeneficio` DECIMAL(5,2) NULL AFTER `porVentaNeta`;
ALTER TABLE `proasistencia`.`clientes_comisionistas`   
  CHANGE `porComer` `manPorVentaNeta` DECIMAL(5,2) NULL,
  ADD COLUMN `manPorBeneficio` DECIMAL(5,2) NULL AFTER `manPorVentaNeta`;
