SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE `clientes`   
  ADD COLUMN `direccion3` VARCHAR(255) NULL AFTER `firmante`,
  ADD COLUMN `codPostal3` VARCHAR(255) NULL AFTER `direccion3`,
  ADD COLUMN `poblacion3` VARCHAR(255) NULL AFTER `codPostal3`,
  ADD COLUMN `provincia3` VARCHAR(255) NULL AFTER `poblacion3`,
  ADD COLUMN `tipoViaId3` INT(11) NULL AFTER `provincia3`,
  ADD CONSTRAINT `ref_cliente_via3` FOREIGN KEY (`tipoViaId3`) REFERENCES `tipos_via`(`tipoIvaId`);

UPDATE clientes SET
tipoViaId = 3 WHERE tipoViaId = 1 OR tipoViaId = 2;
UPDATE clientes SET 
direccion3 = direccion, codPostal3 = codPostal, poblacion3 = poblacion, provincia3 = provincia, tipoViaId3 = tipoViaId;  
SET FOREIGN_KEY_CHECKS = 1;