CREATE TABLE `contactosExpediente` (  
  `contactoExpedienteId` INT(11) NOT NULL AUTO_INCREMENT,
  `expedienteId` INT(11),
  `contactoNombre` VARCHAR(255),
  `telefono1` VARCHAR(255),
  `telefono2` VARCHAR(255),
  `correo` VARCHAR(255),
  `observaciones` TEXT,
  PRIMARY KEY (`contactoExpedienteId`) ,
  CONSTRAINT `contactoExpedienteFK` FOREIGN KEY (`expedienteId`) REFERENCES `expedientes`(`expedienteId`)
);
