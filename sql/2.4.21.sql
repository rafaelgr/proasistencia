CREATE TABLE `notascontrato` (
  `notaId` INT(11) NOT NULL AUTO_INCREMENT,
  `accion` VARCHAR(255) COLLATE utf8_spanish_ci DEFAULT NULL,
  `texto` TEXT COLLATE utf8_spanish_ci,
  `usuarioId` INT(11) DEFAULT NULL,
  `contratoId` INT(11) DEFAULT NULL,
  PRIMARY KEY  (`notaId`),
  KEY `nota_usuarioFK` (`usuarioId`),
  KEY `nota_contratoFK` (`contratoId`),
  CONSTRAINT `nota_contratoFK` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`),
  CONSTRAINT `nota_usuarioFK` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`usuarioId`)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;