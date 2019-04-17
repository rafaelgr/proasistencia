ALTER TABLE `servicios`   
  CHANGE `agenteId` `agenteId` INT(11) NOT NULL COMMENT 'Clave referencia del agente responsable de la solicitud'  FIRST,
  ADD COLUMN `usuarioId` INT(11) NULL AFTER `clienteId`,
  CHANGE `servicioId` `servicioId` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria que identifica a un servicio,'  AFTER `usuarioId`;

ALTER TABLE partes DROP FOREIGN KEY ref_parte_empresa;