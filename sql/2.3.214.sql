ALTER TABLE `clientes`   
  ADD COLUMN `direccionOfertas` VARCHAR(255) NULL AFTER `passWeb`,
  ADD COLUMN `poblacionOfertas` VARCHAR(255) NULL AFTER `direccionOfertas`,
  ADD COLUMN `codPostalOfertas` VARCHAR(255) NULL AFTER `poblacionOfertas`,
  ADD COLUMN `provinciaOfertas` VARCHAR(255) NULL AFTER `codPostalOfertas`,
  ADD COLUMN `tipoViaIdOfertas` INT(11) NULL AFTER `provinciaOfertas`,
  ADD COLUMN `emailOfertas` VARCHAR(255) NULL AFTER `tipoViaIdOfertas`,
  ADD CONSTRAINT `ref_cliente_viaOfertas` FOREIGN KEY (`tipoViaIdOfertas`) REFERENCES `tipos_via`(`tipoViaId`);


ALTER TABLE `clientes`   
  ADD COLUMN `numeroOfertas` VARCHAR(255) NULL AFTER `direccionOfertas`,
  ADD COLUMN `puertaOfertas` VARCHAR(255) NULL AFTER `numeroOfertas`;
