CREATE TABLE `ofertaDocumentacion`(  
  `ofertaCarpetaId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ofertaId` INT(11),
  `carpetaId` INT(11),
  `location` VARCHAR(255),
  `key` VARCHAR(255),
  PRIMARY KEY (`ofertaCarpetaId`),
  CONSTRAINT `carpeta_ofertaFK` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas`(`ofertaId`) ON UPDATE CASCADE
);

CREATE TABLE `carpetas`(  
  `carpetaId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`carpetaId`)
);

ALTER TABLE `carpetas`   
  ADD COLUMN `url` VARCHAR(255) NULL AFTER `nombre`;


INSERT INTO `carpetas` (`nombre`) VALUES ('Oferta cliente'); 
INSERT INTO `carpetas` (`nombre`) VALUES ('Costes profesionales'); 
INSERT INTO `carpetas` (`nombre`) VALUES ('Oferta aceptada'); 
INSERT INTO `carpetas` (`nombre`) VALUES ('Fotografias (Antes) '); 
INSERT INTO `carpetas` (`nombre`) VALUES ('Fotografias (Despues) '); 
UPDATE `carpetas` SET `url` = 's3://comercializa-partes/Oferta cliente/' WHERE `carpetaId` = '1'; 
UPDATE `carpetas` SET `url` = 's3://comercializa-partes/Costes profesionales/' WHERE `carpetaId` = '2'; 
UPDATE `carpetas` SET `url` = 's3://comercializa-partes/Oferta aceptada/' WHERE `carpetaId` = '3'; 
UPDATE `carpetas` SET `url` = 's3://comercializa-partes/Fotografias (Antes)/' WHERE `carpetaId` = '4'; 
UPDATE `carpetas` SET `url` = 's3://comercializa-partes/Fotografias (Despues) /' WHERE `carpetaId` = '5'; 

 ALTER TABLE `proasistencia`.`carpetas` ADD COLUMN `tipo` VARCHAR(255) NULL AFTER `url`; 

 UPDATE carpetas SET tipo = 'oferta';


 ALTER TABLE `parametros` ADD COLUMN `bucket_docum` VARCHAR(255) NULL AFTER `restApi`, 
 ADD COLUMN `bucket_region_docum` VARCHAR(255) NULL AFTER `bucket_docum`, 
 ADD COLUMN `bucket_folder_docum` VARCHAR(255) NULL AFTER `bucket_region_docum`,
 ADD COLUMN `identity_pool_docum` VARCHAR(255) NULL AFTER `bucket_folder_docum`, 
 ADD COLUMN `raiz_url_docum` VARCHAR(255) NULL AFTER `identity_pool_docum`; 
