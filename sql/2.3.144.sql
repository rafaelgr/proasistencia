CREATE TABLE `carpetas` (
  `carpetaId` int(11) unsigned NOT NULL auto_increment,
  `nombre` varchar(255) default NULL,
  `tipo` varchar(255) default NULL,
  PRIMARY KEY  (`carpetaId`)
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

 UPDATE `parametros` SET `raiz_url_docum` = 'https://proas-documentacion.s3-eu-west-1.amazonaws.com/' WHERE `parametroId` = '0'; 
 UPDATE `parametros` SET `identity_pool_docum` = 'eu-west-1:45dceab6-694d-4599-914d-b2be27469500' WHERE `parametroId` = '0';
 UPDATE `parametros` SET `bucket_region_docum` = 'eu-west-1' WHERE `parametroId` = '0';
 UPDATE `parametros` SET `bucket_docum` = 'proas-documentacion' WHERE `parametroId` = '0';  

 ALTER TABLE `carpetas`   
  ADD COLUMN `departamentoId` INT(11) NULL AFTER `tipo`,
  ADD CONSTRAINT `carpeta_departamentoFK` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`);

  UPDATE carpetas SET departamentoId = 7;

ALTER TABLE `carpetas`   
  ADD  UNIQUE INDEX `uniq_nombre` (`nombre`);



  //CARPETA GENERAL DE DOCUMENTACION

  CREATE TABLE `documentacion`(  
  `documentoId` INT(11) NOT NULL AUTO_INCREMENT,
  `ofertaId` INT(11),
  `contratoId` INT(11),
  `parteId` INT(11),
  `carpetaId` INT(11),
  `location` VARCHAR(255),
  `key` VARCHAR(255),
  PRIMARY KEY (`documentoId`)
);





