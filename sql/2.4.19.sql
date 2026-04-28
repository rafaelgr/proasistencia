ALTER TABLE `facturas`   
ADD COLUMN `derivadaId` INT(11) NULL AFTER `rectificativaId`, ADD KEY `factura_derivada` (`derivadaId`); 