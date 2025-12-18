

  ALTER TABLE `contratos`   
	ADD COLUMN `contratoInteresesId` INT(11) NULL AFTER `visulizaEnErp`, 
  ADD  KEY `cnt_intereses` (`contratoInteresesId`);
