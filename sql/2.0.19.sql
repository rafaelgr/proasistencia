ALTER TABLE `contratos`   
  ADD COLUMN `direccion` VARCHAR(255) NULL AFTER `obsFactura`,
  ADD COLUMN `codPostal` VARCHAR(255) NULL AFTER `direccion`,
  ADD COLUMN `poblacion` VARCHAR(255) NULL AFTER `codPostal`,
  ADD COLUMN `tipoViaId` INT(11) NULL AFTER `poblacion`,
  ADD CONSTRAINT `cnt_tipoVia` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via`(`tipoViaId`);

ALTER TABLE `contratos`   
  ADD COLUMN `provincia` VARCHAR(255) NULL AFTER `poblacion`;

UPDATE contratos AS cnt, clientes AS c
SET 
cnt.direccion = c.direccion2, cnt.codPostal = c.codPostal2, cnt.poblacion = c.poblacion2,
cnt.provincia = c.provincia2, cnt.tipoViaId = c.tipoViaId2
WHERE cnt.clienteId = c.clienteId;