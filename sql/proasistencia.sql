/*
SQLyog Community v12.2.4 (64 bit)
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

/*Table structure for table `articulos` */

DROP TABLE IF EXISTS `articulos`;

CREATE TABLE `articulos` (
  `articuloId` int(11) NOT NULL AUTO_INCREMENT,
  `codigoBarras` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precioUnitario` decimal(10,2) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  PRIMARY KEY (`articuloId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `articulos` */

insert  into `articulos`(`articuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`) values (2,NULL,'Mantenimiento general','0.00',5);
insert  into `articulos`(`articuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`) values (3,NULL,'Articulo para pruebas','120.33',5);

/*Table structure for table `clientes` */

DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `clienteId` int(11) NOT NULL AUTO_INCREMENT,
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
  `formaPagoId` int(11) DEFAULT NULL,
  `observaciones` text,
  `tipoClienteId` int(11) DEFAULT '0',
  `cuentaContable` varchar(255) DEFAULT NULL,
  `iban` varchar(255) DEFAULT NULL,
  `comercialId` int(11) DEFAULT NULL COMMENT 'Es el agente por defecto',
  PRIMARY KEY (`clienteId`),
  KEY `fkey_forma_pago` (`formaPagoId`),
  KEY `fkey_tipo_cliente` (`tipoClienteId`),
  CONSTRAINT `fkey_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `fkey_tipo_cliente` FOREIGN KEY (`tipoClienteId`) REFERENCES `tipos_clientes` (`tipoClienteId`)
) ENGINE=InnoDB AUTO_INCREMENT=33870 DEFAULT CHARSET=utf8;

/*Data for the table `clientes` */

insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`) values (25019,NULL,'MANTENIMIENTOS BUENOS S.A.','ASSS','2016-07-01 00:00:00',NULL,1,'Juan Martel',NULL,'Calle del Progreso','28080','Madrid','MADRID','916686888',NULL,NULL,'jm@gmail.com',1,'Es un mantenedor de prueba para ver como funciona',1,'7888888','ES6501822339600011500305',NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`) values (25020,'0','Casas del Mayorazgo','455578B','2016-01-01 00:00:00',NULL,1,NULL,NULL,'Calle del Mayorazgo N.27','46000','Valencia','VALENCIA',NULL,NULL,NULL,NULL,1,NULL,0,'4455555','ES6501822339600011500305',NULL);

/*Table structure for table `clientes_comisionistas` */

DROP TABLE IF EXISTS `clientes_comisionistas`;

CREATE TABLE `clientes_comisionistas` (
  `clienteComisionistaId` int(11) NOT NULL AUTO_INCREMENT,
  `clienteId` int(11) DEFAULT NULL,
  `comercialId` int(11) DEFAULT NULL,
  `porComer` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`clienteComisionistaId`),
  KEY `ref_cc_cliente` (`clienteId`),
  KEY `ref_cc_comercial` (`comercialId`),
  CONSTRAINT `ref_cc_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `ref_cc_comercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `clientes_comisionistas` */

insert  into `clientes_comisionistas`(`clienteComisionistaId`,`clienteId`,`comercialId`,`porComer`) values (1,25020,8,'10.00');
insert  into `clientes_comisionistas`(`clienteComisionistaId`,`clienteId`,`comercialId`,`porComer`) values (2,25020,8,'9.00');

/*Table structure for table `comerciales` */

DROP TABLE IF EXISTS `comerciales`;

CREATE TABLE `comerciales` (
  `comercialId` int(11) NOT NULL AUTO_INCREMENT,
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
  `tipoComercialId` int(11) DEFAULT NULL,
  `formaPagoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`comercialId`),
  KEY `fkey_comercial_forma_pago` (`formaPagoId`),
  CONSTRAINT `fkey_comercial_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;

/*Data for the table `comerciales` */

insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (4,'1','Proasistencia',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (5,'2','Tortajada Fenollera, Juan',NULL,'2000-11-08 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jtortajada@proasistencia.es','',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (6,'3','Anabel','456666','2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',1,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (7,'4','Trejo, Isabel',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (8,'5','Alvarez Linera, Jorge','A45555','2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',1,2);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (9,'6','Coma, Liliana',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (10,'7','Ortega Viota',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (11,'8','Cocero, Sara',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (12,'9','Cristina Moreno',NULL,'2005-06-09 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (13,'10','Javier Longo',NULL,'2006-07-31 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (14,'11','Eduardo Chinarro',NULL,'2008-10-07 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (15,'16','Eduardo Fauquie',NULL,'2009-04-02 17:02:21',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (16,'18','Angel de la Osa Beltrán','789996','2010-03-08 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',5,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (17,'20','Oscar Bermejo',NULL,'2011-04-13 16:39:07',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (18,'27','Jose Luis Cuevas',NULL,'2011-11-14 09:57:53',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (19,'29','CLIENTE PASADO A JOSE LUIS',NULL,'2012-01-30 17:59:10',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (20,'30','CLIENTE PASADO A ISABEL',NULL,'2012-01-30 17:59:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (21,'31','Rosa Carpintero',NULL,'2012-12-03 10:50:30',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (22,'32','OSCAR VARAS',NULL,'2013-10-29 11:07:50',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (23,'33','VICTOR MANUEL',NULL,'2014-01-20 12:57:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (24,'34','CLIENTE PASADO DE JUAN A ISABEL',NULL,'2014-02-25 14:11:06',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (25,'36','Lourdes',NULL,'2014-10-14 16:57:16',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (26,'38','Cliente pasado de Juan a Lourdes',NULL,'2014-10-14 16:58:38',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (27,'39','Patricia',NULL,'2015-02-18 12:25:02',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (28,'40','Clientes pasados a Patricia',NULL,'2015-02-18 12:25:40',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (29,'41','Sonia',NULL,'2015-04-13 11:27:17',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (30,'1','Proasistencia',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (31,'2','Tortajada Fenollera, Juan',NULL,'2000-11-08 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jtortajada@proasistencia.es','',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (32,'3','Anabel',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (33,'4','Trejo, Isabel',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (34,'5','Alvarez Linera, Jorge',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (35,'6','Coma, Liliana',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (36,'7','Ortega Viota',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (37,'8','Cocero, Sara',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (38,'9','Cristina Moreno',NULL,'2005-06-09 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (39,'10','Javier Longo',NULL,'2006-07-31 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (40,'11','Eduardo Chinarro',NULL,'2008-10-07 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (41,'16','Eduardo Fauquie',NULL,'2009-04-02 17:02:21',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (42,'18','Angel de la Osa Beltrán','','2010-03-08 11:36:14',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (43,'20','Oscar Bermejo',NULL,'2011-04-13 16:39:07',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (44,'27','Jose Luis Cuevas',NULL,'2011-11-14 09:57:53',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (45,'29','CLIENTE PASADO A JOSE LUIS',NULL,'2012-01-30 17:59:10',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (46,'30','CLIENTE PASADO A ISABEL',NULL,'2012-01-30 17:59:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (47,'31','Rosa Carpintero',NULL,'2012-12-03 10:50:30',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (48,'32','OSCAR VARAS',NULL,'2013-10-29 11:07:50',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (49,'33','VICTOR MANUEL',NULL,'2014-01-20 12:57:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (50,'34','CLIENTE PASADO DE JUAN A ISABEL',NULL,'2014-02-25 14:11:06',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (51,'36','Lourdes',NULL,'2014-10-14 16:57:16',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (52,'38','Cliente pasado de Juan a Lourdes',NULL,'2014-10-14 16:58:38',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (53,'39','Patricia',NULL,'2015-02-18 12:25:02',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (54,'40','Clientes pasados a Patricia',NULL,'2015-02-18 12:25:40',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (55,'41','Sonia',NULL,'2015-04-13 11:27:17',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (56,'1','Proasistencia',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (57,'2','Tortajada Fenollera, Juan',NULL,'2000-11-08 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jtortajada@proasistencia.es','',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (58,'3','Anabel',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (59,'4','Trejo, Isabel',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (60,'5','Alvarez Linera, Jorge',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (61,'6','Coma, Liliana',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (62,'7','Ortega Viota',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (63,'8','Cocero, Sara',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (64,'9','Cristina Moreno',NULL,'2005-06-09 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (65,'10','Javier Longo',NULL,'2006-07-31 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (66,'11','Eduardo Chinarro',NULL,'2008-10-07 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (67,'16','Eduardo Fauquie',NULL,'2009-04-02 17:02:21',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (68,'18','Angel de la Osa Beltrán','','2010-03-08 11:36:14',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (69,'20','Oscar Bermejo',NULL,'2011-04-13 16:39:07',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (70,'27','Jose Luis Cuevas',NULL,'2011-11-14 09:57:53',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (71,'29','CLIENTE PASADO A JOSE LUIS',NULL,'2012-01-30 17:59:10',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (72,'30','CLIENTE PASADO A ISABEL',NULL,'2012-01-30 17:59:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (73,'31','Rosa Carpintero',NULL,'2012-12-03 10:50:30',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (74,'32','OSCAR VARAS',NULL,'2013-10-29 11:07:50',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (75,'33','VICTOR MANUEL',NULL,'2014-01-20 12:57:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (76,'34','CLIENTE PASADO DE JUAN A ISABEL',NULL,'2014-02-25 14:11:06',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (77,'36','Lourdes',NULL,'2014-10-14 16:57:16',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (78,'38','Cliente pasado de Juan a Lourdes',NULL,'2014-10-14 16:58:38',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (79,'39','Patricia',NULL,'2015-02-18 12:25:02',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (80,'40','Clientes pasados a Patricia',NULL,'2015-02-18 12:25:40',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`tipoComercialId`,`formaPagoId`) values (81,'41','Sonia',NULL,'2015-04-13 11:27:17',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL);

/*Table structure for table `contrato_cliente_mantenimiento` */

DROP TABLE IF EXISTS `contrato_cliente_mantenimiento`;

CREATE TABLE `contrato_cliente_mantenimiento` (
  `contratoClienteMantenimientoId` int(11) NOT NULL AUTO_INCREMENT,
  `empresaId` int(11) DEFAULT NULL,
  `mantenedorId` int(11) DEFAULT NULL,
  `clienteId` int(11) DEFAULT NULL,
  `fechaInicio` date DEFAULT NULL,
  `fechaFin` date DEFAULT NULL,
  `importe` decimal(10,2) DEFAULT NULL,
  `tipoPago` int(11) DEFAULT NULL,
  `manPorComer` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje que se llevaría el mantenedor',
  `observaciones` text,
  `comercialId` int(11) DEFAULT NULL COMMENT 'Es el agente asociado',
  PRIMARY KEY (`contratoClienteMantenimientoId`),
  KEY `ref_ccm_empresa` (`empresaId`),
  KEY `ref_ccm_mantenedor` (`mantenedorId`),
  KEY `ref_ccm_cliente` (`clienteId`),
  CONSTRAINT `ref_ccm_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `ref_ccm_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `ref_ccm_mantenedor` FOREIGN KEY (`mantenedorId`) REFERENCES `clientes` (`clienteId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_cliente_mantenimiento` */

insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`importe`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`) values (1,172,25019,25020,'2016-07-01',NULL,'1200.00',3,NULL,'Creado a mano para ver que funciona correctamente',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`importe`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`) values (4,172,25019,25020,'2016-01-01',NULL,'1450.23',3,NULL,'Creada con POST automático',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`importe`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`) values (5,176,25019,25020,'2016-01-01',NULL,'2500.00',4,'12.45','A ver si graba bien de entrada',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`importe`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`) values (6,178,NULL,25020,'2016-01-01',NULL,'1500.00',4,'10.30','OKKK',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`importe`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`) values (7,172,25019,25020,'2016-01-01',NULL,'1450.23',3,NULL,'Creada con POST automático',NULL);

/*Table structure for table `contrato_cliente_mantenimiento_comisionistas` */

DROP TABLE IF EXISTS `contrato_cliente_mantenimiento_comisionistas`;

CREATE TABLE `contrato_cliente_mantenimiento_comisionistas` (
  `contratoClienteMantenimientoComisionistaId` int(11) NOT NULL AUTO_INCREMENT,
  `contratoClienteMantenimientoId` int(11) DEFAULT NULL,
  `comercialId` int(11) DEFAULT NULL,
  `porComer` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`contratoClienteMantenimientoComisionistaId`),
  KEY `ref_ccmc_ccm` (`contratoClienteMantenimientoId`),
  KEY `ref_ccmc_comercial` (`comercialId`),
  CONSTRAINT `ref_ccmc_ccm` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `ref_ccmc_comercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_cliente_mantenimiento_comisionistas` */

insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porComer`) values (1,6,21,'10.20');
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porComer`) values (3,6,8,'22.00');

/*Table structure for table `contrato_comercial` */

DROP TABLE IF EXISTS `contrato_comercial`;

CREATE TABLE `contrato_comercial` (
  `contratoComercialId` int(11) NOT NULL AUTO_INCREMENT,
  `empresaId` int(11) DEFAULT NULL COMMENT 'Empresa propia que establece el contrato',
  `comercialId` int(11) DEFAULT NULL COMMENT 'Comercial con el que se contrata',
  `fechaInicio` date DEFAULT NULL,
  `fechaFin` date DEFAULT NULL,
  `numMeses` int(11) DEFAULT NULL COMMENT 'Meses de contrato',
  `tipoPago` int(11) DEFAULT NULL COMMENT 'Tipo de pago (1: Único / 2: Mensual',
  `importe` decimal(12,2) DEFAULT NULL,
  `minimoMensual` decimal(12,2) DEFAULT NULL,
  `manImporteOperacion` decimal(12,2) DEFAULT NULL COMMENT 'Importe por operación de mantenimiento',
  `manPorVentas` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje sobre las ventas de mantenimiento',
  `observaciones` text,
  PRIMARY KEY (`contratoComercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_comercial` */

insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`manImporteOperacion`,`manPorVentas`,`observaciones`) values (3,175,6,'2016-06-18','2016-06-12',10,1,NULL,NULL,'0.00','11.10',NULL);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`manImporteOperacion`,`manPorVentas`,`observaciones`) values (4,176,6,'2016-06-17','2016-06-25',10,1,NULL,NULL,'0.00','10.25',NULL);

/*Table structure for table `contrato_mantenedor` */

DROP TABLE IF EXISTS `contrato_mantenedor`;

CREATE TABLE `contrato_mantenedor` (
  `contratoMantenedorId` int(11) NOT NULL AUTO_INCREMENT,
  `empresaId` int(11) DEFAULT NULL,
  `clienteId` int(11) DEFAULT NULL,
  `fechaInicio` date DEFAULT NULL,
  `fechaFin` date DEFAULT NULL,
  `manPorComer` decimal(5,2) DEFAULT NULL,
  `dniFirmanteEmpresa` varchar(255) DEFAULT NULL,
  `firmanteEmpresa` varchar(255) DEFAULT NULL,
  `dniFirmanteMantenedor` varchar(255) DEFAULT NULL,
  `firmanteMantenedor` varchar(255) DEFAULT NULL,
  `observaciones` text,
  `tipoPago` int(11) DEFAULT NULL COMMENT '0= Anual, 1=Semestral, 2=Trimestral, 3=Mensual',
  PRIMARY KEY (`contratoMantenedorId`),
  KEY `fkey_contrato_mantenedor_clientes` (`clienteId`),
  CONSTRAINT `fkey_contrato_mantenedor_clientes` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_mantenedor` */

insert  into `contrato_mantenedor`(`contratoMantenedorId`,`empresaId`,`clienteId`,`fechaInicio`,`fechaFin`,`manPorComer`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteMantenedor`,`firmanteMantenedor`,`observaciones`,`tipoPago`) values (2,175,25019,'2016-07-01',NULL,'10.00','45555','JUUUJ','4555','HJJJJ',NULL,4);

/*Table structure for table `empresas` */

DROP TABLE IF EXISTS `empresas`;

CREATE TABLE `empresas` (
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
  `dniFirmante` varchar(255) DEFAULT NULL,
  `firmante` varchar(255) DEFAULT NULL,
  `contabilidad` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`empresaId`)
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8;

/*Data for the table `empresas` */

insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (172,'1','PROASISTENCIA, S.L.','B81323180','2001-03-30 00:00:00',NULL,1,NULL,NULL,'CAMINO DE REJAS, 1','28820','COSLADA','MADRID',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (173,'2','Román Alonso García','00676698S','2001-10-10 00:00:00',NULL,1,NULL,NULL,'AVENIDA AMERICA, 16','28028','MADRID','MADRID',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (174,'3','OBRAS',NULL,'2001-10-10 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (175,'4','FONDOGAR SL','B81002057','2008-07-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1111','Pablito Ito','conta1');
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (176,'5','GRUPO INMOBILIARIO METROPOLITANO S.A.','A79088159','0001-01-01 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (177,'6','REABITA OBRAS DE REHABILITACION S.L.','B85983054','0001-01-01 00:00:00',NULL,1,NULL,NULL,'REAL, 1 - Nº8 1ºD','28460','LOS MOLINOS','MADRID',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (178,'7','SIERRA DE GUADARRAMA, C.B.','E82315227','0001-01-01 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `formas_pago` */

DROP TABLE IF EXISTS `formas_pago`;

CREATE TABLE `formas_pago` (
  `formaPagoId` int(11) NOT NULL AUTO_INCREMENT,
  `tipoFormaPagoId` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `numeroVencimientos` int(11) DEFAULT NULL,
  `primerVencimiento` int(11) DEFAULT NULL,
  `restoVencimiento` int(11) DEFAULT NULL,
  PRIMARY KEY (`formaPagoId`),
  KEY `fkey_tipo_forma_pago` (`tipoFormaPagoId`),
  CONSTRAINT `fkey_tipo_forma_pago` FOREIGN KEY (`tipoFormaPagoId`) REFERENCES `tipos_forma_pago` (`tipoFormaPagoId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `formas_pago` */

insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`) values (1,0,'Efectivo',1,0,0);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`) values (2,4,'RECIBO 30,60,90',3,30,30);

/*Table structure for table `mantenedores` */

DROP TABLE IF EXISTS `mantenedores`;

CREATE TABLE `mantenedores` (
  `mantenedorId` int(11) NOT NULL AUTO_INCREMENT,
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
  `formaPagoId` int(11) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`mantenedorId`),
  KEY `fkey_mantenedores_forma_pago` (`formaPagoId`),
  CONSTRAINT `fkey_mantenedores_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8;

/*Data for the table `mantenedores` */

insert  into `mantenedores`(`mantenedorId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`formaPagoId`,`observaciones`) values (179,'45','El nombre','A45555','2016-02-01 00:00:00',NULL,NULL,'Persona 1','Persona 2','La dirección','46000','La población','Valencia','9644555455','696666666','7878999','pepe@pepe.com',2,'Y este es el campo de observaciones');
insert  into `mantenedores`(`mantenedorId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`formaPagoId`,`observaciones`) values (180,'1444','Juan','A45566',NULL,NULL,NULL,NULL,'Rafael Garcia','Calle Uruguay N.11 Oficina 101','46007','Valencia','-- Non U.S. --','4963805579','4963805579',NULL,'rafa@myariadna.com',1,NULL);

/*Table structure for table `parametros` */

DROP TABLE IF EXISTS `parametros`;

CREATE TABLE `parametros` (
  `parametroId` int(11) NOT NULL,
  `articuloMantenimiento` int(11) DEFAULT NULL,
  PRIMARY KEY (`parametroId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `parametros` */

insert  into `parametros`(`parametroId`,`articuloMantenimiento`) values (0,2);

/*Table structure for table `prefacturas` */

DROP TABLE IF EXISTS `prefacturas`;

CREATE TABLE `prefacturas` (
  `prefacturaId` int(11) NOT NULL AUTO_INCREMENT,
  `ano` int(11) DEFAULT NULL,
  `numero` int(11) DEFAULT NULL,
  `serie` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `empresaId` int(11) DEFAULT NULL,
  `clienteId` int(11) DEFAULT NULL,
  `contratoClienteMantenimientoId` int(11) DEFAULT NULL,
  `emisorNif` varchar(255) DEFAULT NULL,
  `emisorNombre` varchar(255) DEFAULT NULL,
  `emisorDireccion` varchar(255) DEFAULT NULL,
  `emisorCodPostal` varchar(255) DEFAULT NULL,
  `emisorPoblacion` varchar(255) DEFAULT NULL,
  `emisorProvincia` varchar(255) DEFAULT NULL,
  `receptorNif` varchar(255) DEFAULT NULL,
  `receptorNombre` varchar(255) DEFAULT NULL,
  `receptorDireccion` varchar(255) DEFAULT NULL,
  `receptorCodPostal` varchar(255) DEFAULT NULL,
  `receptorPoblacion` varchar(255) DEFAULT NULL,
  `receptorProvincia` varchar(255) DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `totalConIva` decimal(12,2) DEFAULT NULL,
  `formaPagoId` int(11) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`prefacturaId`),
  KEY `pref_empresas` (`empresaId`),
  KEY `pref_clientes` (`clienteId`),
  KEY `pref_formas_pago` (`formaPagoId`),
  KEY `pref_contratos` (`contratoClienteMantenimientoId`),
  CONSTRAINT `pref_contratos` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `pref_clientes` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `pref_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `pref_formas_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas` */

insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (2,NULL,NULL,NULL,'2016-01-01',172,25019,NULL,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','ASSS','MANTENIMIENTOS BUENOS S.A.','Calle del Progreso','28080','Madrid','MADRID','2165.94','2620.79',1,'Una lista de observaciones');

/*Table structure for table `prefacturas_bases` */

DROP TABLE IF EXISTS `prefacturas_bases`;

CREATE TABLE `prefacturas_bases` (
  `prefacturaBaseId` int(11) NOT NULL AUTO_INCREMENT,
  `prefacturaId` int(11) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `base` decimal(12,2) DEFAULT NULL,
  `cuota` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`prefacturaBaseId`),
  UNIQUE KEY `prefb_prefac_iva` (`prefacturaId`,`tipoIvaId`),
  KEY `prefb_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `prefb_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `prefacturas` (`prefacturaId`),
  CONSTRAINT `prefb_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas_bases` */

insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (50,2,5,'21.00','2165.94','454.85');

/*Table structure for table `prefacturas_lineas` */

DROP TABLE IF EXISTS `prefacturas_lineas`;

CREATE TABLE `prefacturas_lineas` (
  `prefacturaLineaId` int(11) NOT NULL AUTO_INCREMENT,
  `linea` int(11) DEFAULT NULL,
  `prefacturaId` int(11) DEFAULT NULL,
  `articuloId` int(11) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `descripcion` text,
  `cantidad` decimal(6,2) DEFAULT NULL,
  `importe` decimal(10,2) DEFAULT NULL,
  `totalLinea` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`prefacturaLineaId`),
  KEY `prefl_prefacturas` (`prefacturaId`),
  KEY `prefl_articulos` (`articuloId`),
  KEY `prefl_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `prefl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `prefl_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `prefacturas` (`prefacturaId`),
  CONSTRAINT `prefl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas_lineas` */

insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (28,1,2,3,5,'21.00','Articulo para pruebas','1.00','120.33','120.33');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (30,2,2,3,5,'21.00','Articulo para pruebas','1.00','120.33','120.33');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (31,3,2,3,5,'21.00','Cambiamos la descripción','16.00','120.33','1925.28');

/*Table structure for table `tipos_clientes` */

DROP TABLE IF EXISTS `tipos_clientes`;

CREATE TABLE `tipos_clientes` (
  `tipoClienteId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoClienteId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tipos_clientes` */

insert  into `tipos_clientes`(`tipoClienteId`,`nombre`) values (0,'NORMAL');
insert  into `tipos_clientes`(`tipoClienteId`,`nombre`) values (1,'MANTENEDOR');

/*Table structure for table `tipos_comerciales` */

DROP TABLE IF EXISTS `tipos_comerciales`;

CREATE TABLE `tipos_comerciales` (
  `tipoComercialId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoComercialId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tipos_comerciales` */

insert  into `tipos_comerciales`(`tipoComercialId`,`nombre`) values (1,'AGENTE');
insert  into `tipos_comerciales`(`tipoComercialId`,`nombre`) values (2,'COMERCIAL');
insert  into `tipos_comerciales`(`tipoComercialId`,`nombre`) values (3,'DIRECTOR COMERCIAL');
insert  into `tipos_comerciales`(`tipoComercialId`,`nombre`) values (4,'MANTENIMIENTO');
insert  into `tipos_comerciales`(`tipoComercialId`,`nombre`) values (5,'JEFE OBRAS');
insert  into `tipos_comerciales`(`tipoComercialId`,`nombre`) values (6,'OFICINA TÉCNICA');
insert  into `tipos_comerciales`(`tipoComercialId`,`nombre`) values (7,'ASESOR TÉCNICO');

/*Table structure for table `tipos_forma_pago` */

DROP TABLE IF EXISTS `tipos_forma_pago`;

CREATE TABLE `tipos_forma_pago` (
  `tipoFormaPagoId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoFormaPagoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tipos_forma_pago` */

insert  into `tipos_forma_pago`(`tipoFormaPagoId`,`nombre`) values (0,'EFECTIVO');
insert  into `tipos_forma_pago`(`tipoFormaPagoId`,`nombre`) values (1,'TRANSFERENCIA');
insert  into `tipos_forma_pago`(`tipoFormaPagoId`,`nombre`) values (2,'TALON');
insert  into `tipos_forma_pago`(`tipoFormaPagoId`,`nombre`) values (3,'PAGARE');
insert  into `tipos_forma_pago`(`tipoFormaPagoId`,`nombre`) values (4,'RECIBO BANCARIO');
insert  into `tipos_forma_pago`(`tipoFormaPagoId`,`nombre`) values (5,'CONFIRMING');
insert  into `tipos_forma_pago`(`tipoFormaPagoId`,`nombre`) values (6,'TARJETA CREDITO');

/*Table structure for table `tipos_iva` */

DROP TABLE IF EXISTS `tipos_iva`;

CREATE TABLE `tipos_iva` (
  `tipoIvaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `codigoContable` int(11) DEFAULT NULL,
  PRIMARY KEY (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `tipos_iva` */

insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (4,'SIN IVA','0.00',0);
insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (5,'21%','21.00',21);

/*Table structure for table `usuarios` */

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `usuarioId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(765) DEFAULT NULL,
  `login` varchar(765) DEFAULT NULL,
  `password` varchar(765) DEFAULT NULL,
  `email` varchar(765) DEFAULT NULL,
  `nivel` int(11) DEFAULT '0',
  PRIMARY KEY (`usuarioId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `usuarios` */

insert  into `usuarios`(`usuarioId`,`nombre`,`login`,`password`,`email`,`nivel`) values (6,'Administrador Principal','admin','admin','admin@gmail.com',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
