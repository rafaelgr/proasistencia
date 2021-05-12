ALTER TABLE `liquidacion_comercial`   
  ADD COLUMN `ascContratoId` INT(11) NULL AFTER `hFecha`;


ALTER TABLE `liquidacion_comercial_obras`   
  ADD COLUMN `ascContratoId` INT(11) NULL AFTER `contratoId`;
