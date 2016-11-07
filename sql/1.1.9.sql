ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `direccion2` VARCHAR(255) NULL AFTER `agrupacion`,
  ADD COLUMN `codPostal2` VARCHAR(255) NULL AFTER `direccion2`,
  ADD COLUMN `poblacion2` VARCHAR(255) NULL AFTER `codPostal2`,
  ADD COLUMN `provincia2` VARCHAR(255) NULL AFTER `poblacion2`;
ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `tipoViaId2` INT(11) NULL AFTER `provincia2`,
  ADD CONSTRAINT `ref_cliente_via2` FOREIGN KEY (`tipoViaId2`) REFERENCES `proasistencia`.`tipos_via`(`tipoViaId`);  