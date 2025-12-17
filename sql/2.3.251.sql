ALTER TABLE `contratos`   
  ADD COLUMN `fechaFormalizacionContrato` DATE NULL AFTER `resumenDiario`;

ALTER TABLE `contratos`   
  ADD COLUMN `nombrePresidente` VARCHAR(255) NULL AFTER `fechaFormalizacionContrato`,
  ADD COLUMN `dniPresidente` VARCHAR(255) NULL AFTER `nombrePresidente`,
  ADD COLUMN `correoPresidente` VARCHAR(255) NULL AFTER `dniPresidente`;

  ALTER TABLE `contratos`   
	ADD COLUMN `contratoInteresesId` INT(11) NULL AFTER `visulizaEnErp`, 
  ADD  KEY `cnt_intereses` (`contratoInteresesId`);
