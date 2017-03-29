ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `direccion3` VARCHAR(255) NULL AFTER `firmante`,
  ADD COLUMN `codPostal3` VARCHAR(255) NULL AFTER `direccion3`,
  ADD COLUMN `poblacion3` VARCHAR(255) NULL AFTER `codPostal3`,
  ADD COLUMN `provincia3` VARCHAR(255) NULL AFTER `poblacion3`,
  ADD COLUMN `tipoViaId3` INT(11) NULL AFTER `provincia3`,
  ADD CONSTRAINT `ref_cliente_via3` FOREIGN KEY (`tipoViaId3`) REFERENCES `proasistencia`.`tipos_iva`(`tipoIvaId`);