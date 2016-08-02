# El contrato va ahora asociado a un agente
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento`   
  ADD COLUMN `comercialId` INT(11) NULL  COMMENT 'Es el agente asociado' AFTER `observaciones`;
# El cliente tiene un agente asociado por defecto
ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `comercialId` INT(11) NULL  COMMENT 'Es el agente por defecto' AFTER `iban`;
# Nuevos campos para calculos de importe en contrato de mantenimiento
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento`   
  ADD COLUMN `coste` DECIMAL(10,2) NULL AFTER `comercialId`,
  ADD COLUMN `margen` DECIMAL(5,2) NULL AFTER `coste`,
  ADD COLUMN `beneficio` DECIMAL(10,2) NULL AFTER `margen`,
  ADD COLUMN `importeInicial` DECIMAL(10,2) NULL AFTER `beneficio`,
  ADD COLUMN `manAgente` DECIMAL(5,2) NULL AFTER `importeInicial`;
# Nuevo parámetro de margen comercial en mantenimientos
ALTER TABLE `proasistencia`.`parametros`   
  ADD COLUMN `margenMantenimiento` DECIMAL(5,2) NULL AFTER `articuloMantenimiento`;
# Realación de artículo - contrato de mantenimiento para tipicar el contrato
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento`   
  ADD COLUMN `articuloId` INT(11) NULL  COMMENT 'Articulo relacionado que tipifica el contrato' AFTER `manAgente`,
  ADD CONSTRAINT `ref_ccm_articulo` FOREIGN KEY (`articuloId`) REFERENCES `proasistencia`.`articulos`(`articuloId`);