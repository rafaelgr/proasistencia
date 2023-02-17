CREATE TABLE `carpetas` (
  `carpetaId` int(11) unsigned NOT NULL auto_increment,
  `nombre` varchar(255) default NULL,
  `tipo` varchar(255) default NULL,
  PRIMARY KEY  (`carpetaId`)
);

CREATE TABLE `ofertaDocumentacion` (
  `ofertaDocumentoId` int(11) unsigned NOT NULL auto_increment,
  `ofertaId` int(11) default NULL,
  `carpetaId` int(11) default NULL,
  `location` varchar(255) default NULL,
  `key` varchar(255) default NULL,
  PRIMARY KEY  (`ofertaDocumentoId`),
  KEY `carpeta_ofertaFK` (`ofertaId`),
  CONSTRAINT `carpeta_ofertaFK` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas` (`ofertaId`) ON UPDATE CASCADE
);


INSERT INTO `carpetas` (`nombre`) VALUES ('Oferta_cliente'); 
INSERT INTO `carpetas` (`nombre`) VALUES ('Costes_profesionales'); 
INSERT INTO `carpetas` (`nombre`) VALUES ('Oferta_aceptada'); 
INSERT INTO `carpetas` (`nombre`) VALUES ('Fotografias(Antes) '); 
INSERT INTO `carpetas` (`nombre`) VALUES ('Fotografias(Despues) '); 


 UPDATE carpetas SET tipo = 'oferta';


 ALTER TABLE `parametros` ADD COLUMN `bucket_docum` VARCHAR(255) NULL AFTER `restApi`, 
 ADD COLUMN `bucket_region_docum` VARCHAR(255) NULL AFTER `bucket_docum`, 
 ADD COLUMN `bucket_folder_docum` VARCHAR(255) NULL AFTER `bucket_region_docum`,
 ADD COLUMN `identity_pool_docum` VARCHAR(255) NULL AFTER `bucket_folder_docum`, 
 ADD COLUMN `raiz_url_docum` VARCHAR(255) NULL AFTER `identity_pool_docum`; 
