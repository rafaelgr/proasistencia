# El contrato va ahora asociado a un agente
ALTER TABLE `proasistencia`.`contrato_cliente_mantenimiento`   
  ADD COLUMN `comercialId` INT(11) NULL  COMMENT 'Es el agente asociado' AFTER `observaciones`;
# El cliente tiene un agente asociado por defecto
ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `comercialId` INT(11) NULL  COMMENT 'Es el agente por defecto' AFTER `iban`;