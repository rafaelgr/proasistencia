CREATE TABLE `tipos_via`(  
  `tipoViaId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tipoViaId`)
);
ALTER TABLE `empresas`   
  ADD COLUMN `tipoViaId` INT(11) NULL AFTER `contabilidad`,
  ADD CONSTRAINT `ref_empresa_via` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via`(`tipoViaId`);
ALTER TABLE `clientes`   
  ADD COLUMN `tipoViaId` INT(11) NULL AFTER `codigo`,
  ADD CONSTRAINT `ref_cliente_via` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via`(`tipoViaId`);
ALTER TABLE `comerciales`   
  ADD COLUMN `tipoViaId` INT(11) NULL AFTER `porComer`,
  ADD CONSTRAINT `ref_comercial_via` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via`(`tipoViaId`);
    