CREATE TABLE `documentos_pago`(  
  `documentoPagoId` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
   `pdf` VARCHAR(255),
  PRIMARY KEY (`documentoPagoId`)
);

ALTER TABLE `documentos_pago`   
  ADD COLUMN `numero` VARCHAR(255) NULL AFTER `documentoPagoId`;

CREATE TABLE `documentosPago_facproves`(  
  `docfacproveId` INT(11) NOT NULL AUTO_INCREMENT,
  `documentoPagoId` INT(11),
  `facproveId` INT(11),
  PRIMARY KEY (`docfacproveId`),
  CONSTRAINT `documentoFK` FOREIGN KEY (`documentoPagoId`) REFERENCES `proasistencia`.`documentos_pago`(`documentoPagoId`),
  CONSTRAINT `facproveFK` FOREIGN KEY (`facproveId`) REFERENCES `proasistencia`.`facprove`(`facproveId`)
);

