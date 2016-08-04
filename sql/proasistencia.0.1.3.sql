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