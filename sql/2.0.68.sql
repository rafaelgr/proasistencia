CREATE TABLE `clientes_agentes`(  
  `clienteAgenteId` INT(11) NOT NULL AUTO_INCREMENT,
  `clienteId` INT(11),
  `comercialId` INT(11),
  `fechaCambio` DATE,
  PRIMARY KEY (`clienteAgenteId`),
  CONSTRAINT `clienteAgente_clienteFK` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`clienteId`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `clienteAgente_comercialFK` FOREIGN KEY (`comercialId`) REFERENCES `comerciales`(`comercialId`) ON UPDATE CASCADE ON DELETE CASCADE
);
