CREATE TABLE `facprove_retenciones`(  
  `facproveRetencionId` INT(11) NOT NULL AUTO_INCREMENT,
  `facproveId` INT(11) NOT NULL,
  `baseRetencion` DECIMAL(12,2),
  `porcentajeRetencion` DECIMAL(4,2),
  `importeRetencion` DECIMAL(12,2),
  `codigoRetencion` SMALLINT(11),
   `cuentaRetencion` VARCHAR(10),
   KEY(`facproveRetencionId`),
  CONSTRAINT `fecproveRetencion_facproveFK` FOREIGN KEY (`facproveId`) REFERENCES `facprove`(`facproveId`) ON UPDATE CASCADE ON DELETE CASCADE
);



ALTER TABLE `facprove_lineas`   
  ADD COLUMN `porcentajeRetencion` DECIMAL(4,2) DEFAULT 0  AFTER `capituloLinea`,
  ADD COLUMN `importeRetencion` DECIMAL(12,2) DEFAULT 0 AFTER `porcentajeRetencion`,
  ADD COLUMN `codigoRetencion` SMALLINT(11) DEFAULT 0 AFTER `importeRetencion`,
  ADD COLUMN `cuentaRetencion` VARCHAR(10) NULL AFTER `codigoRetencion`;

alter table `usuarios`.`wtiporeten` add column `porcentajePorDefecto` decimal (5,3)   
NULL  after `tipo`, add column `cuentaPorDefecto` varchar (10)   NULL  after `porcentajePorDefecto`;




UPDATE usuarios.wtiporeten SET porcentajePorDefecto = 15, cuentaPorDefecto = '475100003' WHERE codigo = 1;
UPDATE usuarios.wtiporeten SET porcentajePorDefecto = 19, cuentaPorDefecto = '475100002' WHERE codigo = 3;

UPDATE  facprove f, facprove_lineas AS li  
SET li.porcentajeRetencion = f.porcentajeRetencion, li.importeRetencion = f.importeRetencion, li.codigoRetencion = 1, li.cuentaRetencion = 475100003
   WHERE f.facproveId = li.facproveId AND f.contabilizada = 0 AND f.porcentajeRetencion = 15 AND f.facproveId != 69 
   
INSERT INTO facprove_retenciones (facproveId,baseRetencion,porcentajeRetencion,importeRetencion,codigoRetencion,cuentaretencion)
   (SELECT li.facproveId, li.totalLinea, li.porcentajeRetencion, li.importeRetencion, li.codigoRetencion, li.cuentaRetencion FROM facprove_lineas AS li 
LEFT JOIN facprove AS f ON f.facproveId = li.facproveId 
WHERE  f.contabilizada = 0 AND f.facproveId != 69 AND f.porcentajeRetencion = 0 OR f.contabilizada = 0 AND f.facproveId != 69)
