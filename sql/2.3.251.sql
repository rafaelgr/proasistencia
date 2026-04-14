

  ALTER TABLE `contratos`   
	ADD COLUMN `contratoInteresesId` INT(11) NULL AFTER `visualizaEnErp`, 
  ADD  KEY `cnt_intereses` (`contratoInteresesId`);
