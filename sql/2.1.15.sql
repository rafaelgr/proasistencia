CREATE TABLE `facprove_retenciones`(  
  `facproveRetencionId` INT(11) NOT NULL AUTO_INCREMENT,
  `facproveId` INT(11) NOT NULL,
  `baseRetencion` DECIMAL(12,0),
  `porcentajeRetencion` DECIMAL(4,2),
  `importeRetencion` DECIMAL(12,2),
   KEY(`facproveRetencionId`),
  CONSTRAINT `fecproveRetencion_facproveFK` FOREIGN KEY (`facproveId`) REFERENCES `facprove`(`facproveId`) ON UPDATE CASCADE ON DELETE NO ACTION
);


ALTER TABLE `facprove_lineas`   
  ADD COLUMN `porcentajeRetencion` DECIMAL(4,2) DEFAULT 0  AFTER `capituloLinea`,
  ADD COLUMN `importeRetencion` DECIMAL(12,2) DEFAULT 0 AFTER `porcentajeRetencion`;

