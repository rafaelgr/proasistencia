ALTER TABLE `contratos`   
  CHANGE `clienteId` `clienteId` INT(11) NULL COMMENT 'Cliente final al que va dirigida el contrato';

ALTER TABLE `departamentos`   
  ADD COLUMN `usaCliente` TINYINT(1) DEFAULT 1 NULL AFTER `usaCalculadora`;