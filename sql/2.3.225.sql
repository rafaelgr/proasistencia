CREATE TABLE `comercialCorreos` (  
  `comercialCorreoId` INT(11) NOT NULL AUTO_INCREMENT,
  `comercialId` INT(11),
  `empresaId` INT(11),
  `departamentoId` INT(11),
  `correo` VARCHAR(255),
  `password` VARCHAR(255),
  PRIMARY KEY (`comercialCorreoId`) ,
  CONSTRAINT `comercialCorreo_comercialFK` FOREIGN KEY (`comercialId`) REFERENCES `comerciales`(`comercialId`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT `comercialCorreo_empresaFK` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT `comercialCorreo_departamentosFK` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

ALTER TABLE `comercialcorreos`   
  ADD  UNIQUE INDEX `UNIQUE_comercialEmpresa` (`comercialId` , `empresaId`);

  INSERT INTO `comercialCorreos` VALUES (0,737,2,8,'igomezacebo@proasistencia.es','Cecilia2011'),
	(0,739,2,8,'jlescribano@proasistencia.es','Escribano14'),
	(0,801,2,8,'edelcarmen@proasistencia.es','Elvira456'),
	(0,812,2,8,' jgallarin@proasistencia.es','Gallarin123'),
	(0,24,2,8,'pmarina@proasistencia.es','Marina14'),
	(0,826,2,8,'amsanchez@proasistencia.es','Antonia123'),
	(0,737,7,8,'reabita@reabita.es','Cecilia2011'),
	(0,739,7,8,'jlescribano@reabita.es','Escribano14'),
	(0,801,7,8,'edelcarmen@reabita.es','Elvira456'),
	(0,812,7,8,'jgallarin@reabita.es','Gallarin123'),
	(0,24,7,8,'pmarina@reabita.es','Marina16'),
	(0,826,7,8,'amsanchez@reabita.es','Antonia123');

