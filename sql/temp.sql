/*
SQLyog Community v12.2.1 (64 bit)
MySQL - 5.6.16 : Database - proasistencia
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `proasistencia`;

/*Table structure for table `mantenedores` */

DROP TABLE IF EXISTS `mantenedores`;

CREATE TABLE `mantenedores` (
  `empresaId` int(11) NOT NULL AUTO_INCREMENT,
  `proId` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `nif` varchar(255) DEFAULT NULL,
  `fechaAlta` datetime DEFAULT NULL,
  `fechaBaja` datetime DEFAULT NULL,
  `activa` tinyint(1) DEFAULT NULL,
  `contacto1` varchar(255) DEFAULT NULL,
  `contacto2` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `codPostal` varchar(255) DEFAULT NULL,
  `poblacion` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `telefono1` varchar(255) DEFAULT NULL,
  `telefono2` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`empresaId`)
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8;

/*Data for the table `mantenedores` */

insert  into `mantenedores`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`) values (172,'1','PROASISTENCIA, S.L.','B81323180','2001-03-30 00:00:00',NULL,1,NULL,NULL,'CAMINO DE REJAS, 1','28820','COSLADA','MADRID',NULL,NULL,NULL,NULL,NULL);
insert  into `mantenedores`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`) values (173,'2','Román Alonso García','00676698S','2001-10-10 00:00:00',NULL,1,NULL,NULL,'AVENIDA AMERICA, 16','28028','MADRID','MADRID',NULL,NULL,NULL,NULL,NULL);
insert  into `mantenedores`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`) values (174,'3','OBRAS',NULL,'2001-10-10 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `mantenedores`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`) values (175,'4','FONDOGAR SL','B81002057','2008-07-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `mantenedores`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`) values (176,'5','GRUPO INMOBILIARIO METROPOLITANO S.A.','A79088159','0001-01-01 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `mantenedores`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`) values (177,'6','REABITA OBRAS DE REHABILITACION S.L.','B85983054','0001-01-01 00:00:00',NULL,1,NULL,NULL,'REAL, 1 - Nº8 1ºD','28460','LOS MOLINOS','MADRID',NULL,NULL,NULL,NULL,NULL);
insert  into `mantenedores`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`) values (178,'7','SIERRA DE GUADARRAMA, C.B.','E82315227','0001-01-01 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
