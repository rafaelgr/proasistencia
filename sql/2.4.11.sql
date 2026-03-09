CREATE TABLE `contrato_adicionales` (  
  `trabajoAdicionalId` INT(11) NOT NULL AUTO_INCREMENT,
  `contratoId` INT(11),
  `concepto` VARCHAR(255),
  `fecha` DATE,
  `importe` DECIMAL(12,2),
  `contratoAdicionalId` INT(11),
  `refPresupuestoAdicional` VARCHAR(255),
  `externa` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`trabajoAdicionalId`) ,
  KEY `idexterna` (`contratoAdicionalId`),
  CONSTRAINT `adicionalContratoFK` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`) ON DELETE CASCADE
);


ALTER TABLE `contratos`   
	ADD COLUMN `nExpediente` VARCHAR(255) NULL AFTER `fechaJunta`;
