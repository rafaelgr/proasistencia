CREATE TABLE `capitulosTecnicos` (  
  `grupoArticuloId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  `referencia` VARCHAR(255),
  PRIMARY KEY (`grupoArticuloId`) 
) ENGINE=INNODB CHARSET=latin1 COLLATE=latin1_spanish_ci;
