CREATE TABLE `contratorenovados`(  
  `contratoRenovadoId` INT(11) NOT NULL AUTO_INCREMENT,
  `contratoOriginalId` INT(11),
  `renovadoId` INT(11),
  `fechaRenovacion` DATE,
  PRIMARY KEY (`contratoRenovadoId`),
  CONSTRAINT `contratoOriginalFK` FOREIGN KEY (`contratoOriginalId`) REFERENCES `contratos`(`contratoId`),
  CONSTRAINT `contratoRenovadoFK` FOREIGN KEY (`renovadoId`) REFERENCES `contratos`(`contratoId`)
);
