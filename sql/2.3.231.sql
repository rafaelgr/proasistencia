CREATE TABLE`profesiones_departamentos` (  
  `profesionDepartamentoId` INT(11) NOT NULL AUTO_INCREMENT,
  `tipoProfesionId` INT(11),
  `departamentoId` INT(11),
  PRIMARY KEY (`profesionDepartamentoId`) ,
  CONSTRAINT `profesionesDepartamentoProfesionFK` FOREIGN KEY (`tipoProfesionId`) REFERENCES`tipos_profesionales`(`tipoProfesionalId`),
  CONSTRAINT `profesionesDepartamentosDepartamentoFK` FOREIGN KEY (`departamentoId`) REFERENCES`departamentos`(`departamentoId`)
);


ALTER TABLE `profesiones_departamentos` DROP FOREIGN KEY `profesionesDepartamentoProfesionFK`;

ALTER TABLE `profesiones_departamentos` ADD CONSTRAINT `profesionesDepartamentoProfesionFK` FOREIGN KEY (`tipoProfesionId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `profesiones_departamentos` DROP FOREIGN KEY `profesionesDepartamentosDepartamentoFK`;

ALTER TABLE `profesiones_departamentos` ADD CONSTRAINT `profesionesDepartamentosDepartamentoFK` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`) ON UPDATE CASCADE ON DELETE CASCADE;


ALTER TABLE `articulos`   
	CHANGE `coste` `coste` DECIMAL(14,4) DEFAULT 0.00 NULL;



ALTER TABLE `ofertas_lineas`   
	CHANGE `totalLinea` `totalLinea` DECIMAL(14,4) NULL,
	CHANGE `ventaNetaLinea` `ventaNetaLinea` DECIMAL(14,4) DEFAULT 0.00 NULL,
	CHANGE `precio` `precio` DECIMAL(14,4) NULL;
