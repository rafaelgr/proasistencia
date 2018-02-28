CREATE TABLE `facprove_serviciados`(  
  `facproveServiciadoId` INT(11) NOT NULL AUTO_INCREMENT,
  `facproveId` INT(11),
  `empresaId` INT(11),
  `contratoId` INT(11),
  `importe` DECIMAL(12,2),
  PRIMARY KEY (`facproveServiciadoId`),
  CONSTRAINT `serviciados_facproveFK` FOREIGN KEY (`facproveId`) REFERENCES `facprove`(`facproveId`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `serviciados_empresaFK` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `serviciados_contratoFK` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`) ON UPDATE CASCADE ON DELETE CASCADE
);
