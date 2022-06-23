CREATE TABLE `documentos_pago`(  
  `documentoPagoId` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
   `pdf` VARCHAR(255),
  `facproveId` INT(11),
  PRIMARY KEY (`documentoPagoId`),
  CONSTRAINT `documentoPago_facproveFK` FOREIGN KEY (`facproveId`) REFERENCES `facprove`(`facproveId`)
);
