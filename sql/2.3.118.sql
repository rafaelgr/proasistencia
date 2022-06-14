ALTER TABLE `tipos_comerciales`   
  ADD COLUMN `informeColaboradorObras` VARCHAR(255) NULL AFTER `nombre`;


UPDATE `tipos_comerciales` SET `informeColaboradorObras` = 'liqObr_dTecnico' 
WHERE `tipoComercialId` = '3'; 
UPDATE `tipos_comerciales` SET `informeColaboradorObras` = 'liqObr_oTecnica' WHERE `tipoComercialId` = '6'; 
UPDATE `tipos_comerciales` SET `informeColaboradorObras` = 'liqObr_jObras' WHERE `tipoComercialId` = '5'; 
UPDATE `tipos_comerciales` SET `informeColaboradorObras` = 'liqObr_tecnico' WHERE `tipoComercialId` = '7'; 
UPDATE `tipos_comerciales` SET `informeColaboradorObras` = 'liqObr_comercial' WHERE `tipoComercialId` = '2'; 