ALTER TABLE `facturas`   
  ADD COLUMN `enviadaCorreo` BOOL DEFAULT FALSE NULL AFTER `prefacturaId`,
  ADD COLUMN `ficheroCorreo` VARCHAR(255) NULL AFTER `enviadaCorreo`;

CREATE TABLE `plantillas_correo_facturas`(  
  `plaCoFacId` INT(11) NOT NULL AUTO_INCREMENT,
  `empresaId` INT(11),
  `plaCoFacData` BLOB,
  PRIMARY KEY (`plaCoFacId`),
  CONSTRAINT `ref_plaCoFa_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`)
);
