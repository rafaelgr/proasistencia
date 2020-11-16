ALTER TABLE `contratos`   
  ADD COLUMN `ascContratoId` INT(11) NULL COMMENT 'código del contrato asociado' AFTER `antContratoId`;


  ALTER TABLE `contratos`   
  DROP COLUMN `calculoInverso`;

INSERT INTO `usuarios`.`wtiporeten` (`codigo`, `descripcion`, `tipo`, `porcentajePorDefecto`, `cuentaPorDefecto`) VALUES ('9', 'ACTIVIDAD PROFIONAL 1%', '0', '1.000', '475100003'); 