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
