CREATE TABLE `departamentos` (
  `departamentoId` int(11) NOT NULL,
  `nombre` varchar(255) default NULL,
  PRIMARY KEY  (`departamentoId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `departamentos` */

insert  into `departamentos`(`departamentoId`,`nombre`) values (1,'MANTENIMIENTO');
insert  into `departamentos`(`departamentoId`,`nombre`) values (2,'SEGUROS');
insert  into `departamentos`(`departamentoId`,`nombre`) values (3,'ALQUILERES');
insert  into `departamentos`(`departamentoId`,`nombre`) values (4,'FINCAS');
insert  into `departamentos`(`departamentoId`,`nombre`) values (5,'ARQUITECTURA');
insert  into `departamentos`(`departamentoId`,`nombre`) values (6,'ADMINISTRACIÓN');
insert  into `departamentos`(`departamentoId`,`nombre`) values (7,'REPARACIONES');


ALTER TABLE `departamentos`   
  CHANGE `departamentoId` `departamentoId` INT(11) NOT NULL AUTO_INCREMENT;

  CREATE TABLE `usuarios_departamentos`(  
  `usuarioDepartamentoId` INT(11) NOT NULL AUTO_INCREMENT,
  `usuarioId` INT(11),
  `departamentoId` INT(11),
  PRIMARY KEY (`usuarioDepartamentoId`),
  CONSTRAINT `usuarioDepartamento_usuariosFK` FOREIGN KEY (`usuarioId`) REFERENCES `proasistencia`.`usuarios`(`usuarioId`) ON UPDATE CASCADE ON DELETE NO ACTION,
  CONSTRAINT `usuarioDepartamento_departamentosFK` FOREIGN KEY (`departamentoId`) REFERENCES `proasistencia`.`departamentos`(`departamentoId`) ON UPDATE CASCADE ON DELETE NO ACTION
);

ALTER TABLE `usuarios_departamentos`   
  ADD  UNIQUE INDEX `uniqueDepartamento` (`usuarioId`, `departamentoId`);


  ALTER TABLE `contratos` 
  ADD CONSTRAINT `cnt_tipoDepartamento` FOREIGN KEY (`tipoContratoId`) REFERENCES `departamentos`(`departamentoId`),
  DROP FOREIGN KEY `cnt_tipoMantenimiento`;



