UPDATE comerciales 
SET activa = 1
WHERE fechaBaja IS NULL;

UPDATE comerciales 
SET activa = 0
WHERE NOT fechaBaja IS NULL;


ALTER TABLE `contrato_cliente_mantenimiento`   
  ADD COLUMN `diaPago` INT(11) NULL AFTER `fechaOriginal`;
