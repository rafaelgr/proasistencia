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
  `grupoArticuloId` int(11) DEFAULT NULL,
  `codigoBarras` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precioUnitario` decimal(10,2) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  `descripcion` text,
  `unidadId` int(11) DEFAULT NULL,
  PRIMARY KEY (`articuloId`),
  KEY `ref_art_grupo` (`grupoArticuloId`),
  KEY `ref_art_unidades` (`unidadId`),
  CONSTRAINT `ref_art_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`),
  CONSTRAINT `ref_art_grupo` FOREIGN KEY (`grupoArticuloId`) REFERENCES `grupo_articulo` (`grupoArticuloId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `articulos` */

insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (2,NULL,NULL,'Mantenimiento general','0.00',11,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (3,NULL,NULL,'Articulo para pruebas','120.33',11,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (4,NULL,NULL,'Tipo de mantenimiento 1','0.00',11,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (5,NULL,NULL,'Tipo mantenimiento 2','0.00',14,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (6,4,NULL,'Mantenimiento de ascensores','12.63',11,'Esta es la descripción larga en la \nque se\ncuenta\ntodo\n',1);

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
  `email2` varchar(255) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=33871 DEFAULT CHARSET=utf8;

/*Data for the table `clientes` */

insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`) values (25019,'88','MANTENIMIENTOS BUENOS S.A.','ASSS','2016-07-01 00:00:00',NULL,1,'Juan Martel',NULL,'Calle del Progreso','28080','Madrid','MADRID','916686888',NULL,NULL,'jm@gmail.com',NULL,1,'Es un mantenedor de prueba para ver como funciona',1,'430000088','ES6501822339600011500305',NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`) values (25020,'13','Casas del Mayorazgo','455578B','2016-01-01 00:00:00',NULL,1,NULL,NULL,'Calle del Mayorazgo N.27','46000','Valencia','VALENCIA',NULL,NULL,NULL,'e1@gmail.com','e2@gmail.com',1,NULL,0,'430000013','ES6501822339600011500305',8);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`) values (33870,'12','Nombre del clientre','A4555',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,0,'430000012','51215555',6);

/*Table structure for table `clientes_comisionistas` */

DROP TABLE IF EXISTS `clientes_comisionistas`;

CREATE TABLE `clientes_comisionistas` (
  `clienteComisionistaId` int(11) NOT NULL AUTO_INCREMENT,
  `clienteId` int(11) DEFAULT NULL,
  `comercialId` int(11) DEFAULT NULL,
  `manPorVentaNeta` decimal(5,2) DEFAULT NULL,
  `manPorBeneficio` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`clienteComisionistaId`),
  KEY `ref_cc_cliente` (`clienteId`),
  KEY `ref_cc_comercial` (`comercialId`),
  CONSTRAINT `ref_cc_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `ref_cc_comercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `clientes_comisionistas` */

insert  into `clientes_comisionistas`(`clienteComisionistaId`,`clienteId`,`comercialId`,`manPorVentaNeta`,`manPorBeneficio`) values (2,25020,8,'9.00',NULL);
insert  into `clientes_comisionistas`(`clienteComisionistaId`,`clienteId`,`comercialId`,`manPorVentaNeta`,`manPorBeneficio`) values (4,25020,7,'10.00','14.00');

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
  `email2` varchar(255) DEFAULT NULL,
  `observaciones` text,
  `tipoComercialId` int(11) DEFAULT NULL,
  `formaPagoId` int(11) DEFAULT NULL,
  `dniFirmante` varchar(255) DEFAULT NULL,
  `firmante` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`comercialId`),
  KEY `fkey_comercial_forma_pago` (`formaPagoId`),
  CONSTRAINT `fkey_comercial_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;

/*Data for the table `comerciales` */

insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (4,'1','Proasistencia',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (5,'2','Tortajada Fenollera, Juan',NULL,'2000-11-08 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jtortajada@proasistencia.es',NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (6,'3','Anabel','456666','2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',1,NULL,'5555','Spiderman');
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (7,'4','Trejo, Isabel',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (8,'5','Alvarez Linera, Jorge','A45555','2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'e1@gmail.com','e2@gmail.com','',1,2,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (9,'6','Coma, Liliana',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (10,'7','Ortega Viota',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (11,'8','Cocero, Sara',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (12,'9','Cristina Moreno',NULL,'2005-06-09 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (13,'10','Javier Longo',NULL,'2006-07-31 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (14,'11','Eduardo Chinarro',NULL,'2008-10-07 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (15,'16','Eduardo Fauquie',NULL,'2009-04-02 17:02:21',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (16,'18','Angel de la Osa Beltrán','789996','2010-03-08 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',5,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (17,'20','Oscar Bermejo',NULL,'2011-04-13 16:39:07',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (18,'27','Jose Luis Cuevas',NULL,'2011-11-14 09:57:53',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (19,'29','CLIENTE PASADO A JOSE LUIS',NULL,'2012-01-30 17:59:10',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (20,'30','CLIENTE PASADO A ISABEL',NULL,'2012-01-30 17:59:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (21,'31','Rosa Carpintero',NULL,'2012-12-03 10:50:30',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (22,'32','OSCAR VARAS',NULL,'2013-10-29 11:07:50',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (23,'33','VICTOR MANUEL',NULL,'2014-01-20 12:57:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (24,'34','CLIENTE PASADO DE JUAN A ISABEL',NULL,'2014-02-25 14:11:06',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (25,'36','Lourdes',NULL,'2014-10-14 16:57:16',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (26,'38','Cliente pasado de Juan a Lourdes',NULL,'2014-10-14 16:58:38',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (27,'39','Patricia',NULL,'2015-02-18 12:25:02',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (28,'40','Clientes pasados a Patricia',NULL,'2015-02-18 12:25:40',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (29,'41','Sonia',NULL,'2015-04-13 11:27:17',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (30,'1','Proasistencia',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (31,'2','Tortajada Fenollera, Juan',NULL,'2000-11-08 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jtortajada@proasistencia.es',NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (32,'3','Anabel',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (33,'4','Trejo, Isabel',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (35,'6','Coma, Liliana',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (36,'7','Ortega Viota',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (37,'8','Cocero, Sara',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (38,'9','Cristina Moreno',NULL,'2005-06-09 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (39,'10','Javier Longo',NULL,'2006-07-31 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (40,'11','Eduardo Chinarro',NULL,'2008-10-07 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (41,'16','Eduardo Fauquie',NULL,'2009-04-02 17:02:21',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (42,'18','Angel de la Osa Beltrán','','2010-03-08 11:36:14',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (43,'20','Oscar Bermejo',NULL,'2011-04-13 16:39:07',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (44,'27','Jose Luis Cuevas',NULL,'2011-11-14 09:57:53',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (45,'29','CLIENTE PASADO A JOSE LUIS',NULL,'2012-01-30 17:59:10',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (46,'30','CLIENTE PASADO A ISABEL',NULL,'2012-01-30 17:59:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (47,'31','Rosa Carpintero',NULL,'2012-12-03 10:50:30',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (48,'32','OSCAR VARAS',NULL,'2013-10-29 11:07:50',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (49,'33','VICTOR MANUEL',NULL,'2014-01-20 12:57:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (50,'34','CLIENTE PASADO DE JUAN A ISABEL',NULL,'2014-02-25 14:11:06',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (51,'36','Lourdes',NULL,'2014-10-14 16:57:16',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (52,'38','Cliente pasado de Juan a Lourdes',NULL,'2014-10-14 16:58:38',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (53,'39','Patricia',NULL,'2015-02-18 12:25:02',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (54,'40','Clientes pasados a Patricia',NULL,'2015-02-18 12:25:40',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (55,'41','Sonia',NULL,'2015-04-13 11:27:17',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (56,'1','Proasistencia',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (57,'2','Tortajada Fenollera, Juan',NULL,'2000-11-08 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jtortajada@proasistencia.es',NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (58,'3','Anabel',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (59,'4','Trejo, Isabel',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (61,'6','Coma, Liliana',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (62,'7','Ortega Viota',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (63,'8','Cocero, Sara',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (64,'9','Cristina Moreno',NULL,'2005-06-09 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (65,'10','Javier Longo',NULL,'2006-07-31 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (66,'11','Eduardo Chinarro',NULL,'2008-10-07 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (67,'16','Eduardo Fauquie',NULL,'2009-04-02 17:02:21',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (68,'18','Angel de la Osa Beltrán','','2010-03-08 11:36:14',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (69,'20','Oscar Bermejo',NULL,'2011-04-13 16:39:07',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (70,'27','Jose Luis Cuevas',NULL,'2011-11-14 09:57:53',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (71,'29','CLIENTE PASADO A JOSE LUIS',NULL,'2012-01-30 17:59:10',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (72,'30','CLIENTE PASADO A ISABEL',NULL,'2012-01-30 17:59:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (73,'31','Rosa Carpintero',NULL,'2012-12-03 10:50:30',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (74,'32','OSCAR VARAS',NULL,'2013-10-29 11:07:50',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (75,'33','VICTOR MANUEL',NULL,'2014-01-20 12:57:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (76,'34','CLIENTE PASADO DE JUAN A ISABEL',NULL,'2014-02-25 14:11:06',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (77,'36','Lourdes',NULL,'2014-10-14 16:57:16',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (78,'38','Cliente pasado de Juan a Lourdes',NULL,'2014-10-14 16:58:38',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (79,'39','Patricia',NULL,'2015-02-18 12:25:02',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (80,'40','Clientes pasados a Patricia',NULL,'2015-02-18 12:25:40',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`) values (81,'41','Sonia',NULL,'2015-04-13 11:27:17',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);

/*Table structure for table `contrato_cliente_mantenimiento` */

DROP TABLE IF EXISTS `contrato_cliente_mantenimiento`;

CREATE TABLE `contrato_cliente_mantenimiento` (
  `contratoClienteMantenimientoId` int(11) NOT NULL AUTO_INCREMENT,
  `empresaId` int(11) DEFAULT NULL,
  `mantenedorId` int(11) DEFAULT NULL,
  `clienteId` int(11) DEFAULT NULL,
  `fechaInicio` date DEFAULT NULL,
  `fechaFin` date DEFAULT NULL,
  `venta` decimal(10,2) DEFAULT NULL,
  `tipoPago` int(11) DEFAULT NULL,
  `manPorComer` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje que se llevaría el mantenedor',
  `observaciones` text,
  `comercialId` int(11) DEFAULT NULL COMMENT 'Es el agente asociado',
  `coste` decimal(10,2) DEFAULT NULL,
  `margen` decimal(5,2) DEFAULT NULL,
  `beneficio` decimal(10,2) DEFAULT NULL,
  `ventaNeta` decimal(10,2) DEFAULT NULL,
  `manAgente` decimal(5,2) DEFAULT NULL,
  `articuloId` int(11) DEFAULT NULL COMMENT 'Articulo relacionado que tipifica el contrato',
  `importeAlCliente` decimal(10,2) DEFAULT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`contratoClienteMantenimientoId`),
  KEY `ref_ccm_empresa` (`empresaId`),
  KEY `ref_ccm_mantenedor` (`mantenedorId`),
  KEY `ref_ccm_cliente` (`clienteId`),
  KEY `ref_ccm_articulo` (`articuloId`),
  CONSTRAINT `ref_ccm_articulo` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `ref_ccm_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `ref_ccm_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `ref_ccm_mantenedor` FOREIGN KEY (`mantenedorId`) REFERENCES `clientes` (`clienteId`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_cliente_mantenimiento` */

insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (26,172,NULL,25020,'2016-08-01',NULL,'1000.00',3,NULL,NULL,6,'124.00','20.30','773.50','897.50','10.25',5,'1000.00',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (27,172,25019,33870,'2016-08-01','2017-08-01','1080.00',4,'10.00',NULL,6,'30.00','20.30','996.00','1026.00','5.00',6,'1200.00',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (28,172,NULL,25020,'2016-08-02',NULL,'633.97',4,NULL,NULL,6,'478.00','20.30','97.03','575.03','10.25',NULL,NULL,NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (29,172,NULL,25020,'2016-01-01','2017-01-01','1500.00',4,'0.00','Este es el que va a servir de pruebas para periodificaciones',6,'490.00','20.30','860.00','1350.00','10.00',4,'1500.00',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (32,172,NULL,33870,NULL,NULL,'643.39',2,NULL,NULL,6,'480.00','20.30','97.44','577.44','10.25',NULL,NULL,NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (33,172,NULL,25020,NULL,NULL,'670.19',1,NULL,NULL,6,'500.00','20.30','101.50','601.50','10.25',NULL,NULL,NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (35,172,25019,33870,NULL,NULL,'2412.00',2,'10.00','Este con todos sus campos montados',6,'145.00','20.30','2019.77','2164.77','10.25',NULL,'2680.00',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (36,172,NULL,25020,'2016-08-01',NULL,'1200.00',2,'0.00',NULL,8,'0.00','20.30','1080.00','1080.00','10.00',5,'1200.00',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (37,172,NULL,25020,NULL,NULL,'1500.00',1,'0.00',NULL,6,'125.00','20.30','1150.00','1275.00','15.00',NULL,'1500.00',NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`) values (38,175,NULL,25020,'2016-09-04','2017-09-23','225.00',4,'10.00',NULL,8,'0.00','20.30','191.25','191.25','15.00',2,'250.00',NULL);

/*Table structure for table `contrato_cliente_mantenimiento_comisionistas` */

DROP TABLE IF EXISTS `contrato_cliente_mantenimiento_comisionistas`;

CREATE TABLE `contrato_cliente_mantenimiento_comisionistas` (
  `contratoClienteMantenimientoComisionistaId` int(11) NOT NULL AUTO_INCREMENT,
  `contratoClienteMantenimientoId` int(11) DEFAULT NULL,
  `comercialId` int(11) DEFAULT NULL,
  `porVentaNeta` decimal(5,2) DEFAULT NULL,
  `porBeneficio` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`contratoClienteMantenimientoComisionistaId`),
  KEY `ref_ccmc_ccm` (`contratoClienteMantenimientoId`),
  KEY `ref_ccmc_comercial` (`comercialId`),
  CONSTRAINT `ref_ccmc_ccm` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `ref_ccmc_comercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_cliente_mantenimiento_comisionistas` */

insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (13,26,8,'10.00',NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (14,26,8,'9.00',NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (15,28,8,'9.00',NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (16,28,8,'10.00',NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (17,29,8,'10.00',NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (18,29,8,'9.00',NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (21,35,6,'15.00','10.00');
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (22,26,6,'15.00','10.00');
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (23,36,8,'10.00','13.00');
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (24,36,6,NULL,NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (25,37,8,'9.00',NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (26,37,6,'10.00','12.00');
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (27,38,8,'9.00',NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (28,38,6,'10.00','12.00');

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
  `manPorVentaNeta` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje sobre venta neta',
  `manPorBeneficio` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje sobre beneficio',
  `observaciones` text,
  `dniFirmanteEmpresa` varchar(255) DEFAULT NULL,
  `firmanteEmpresa` varchar(255) DEFAULT NULL,
  `dniFirmanteColaborador` varchar(255) DEFAULT NULL,
  `firmanteColaborador` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`contratoComercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_comercial` */

insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`manPorVentaNeta`,`manPorBeneficio`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`) values (3,175,6,'2016-06-18','2016-06-12',10,3,NULL,NULL,'10.00','0.00',NULL,'45555','Firmante de empresa','66666','Firmante del colaborador');
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`manPorVentaNeta`,`manPorBeneficio`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`) values (4,172,6,'2016-06-17','2016-06-25',10,1,NULL,NULL,'15.00','10.00',NULL,NULL,NULL,NULL,NULL);

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

insert  into `contrato_mantenedor`(`contratoMantenedorId`,`empresaId`,`clienteId`,`fechaInicio`,`fechaFin`,`manPorComer`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteMantenedor`,`firmanteMantenedor`,`observaciones`,`tipoPago`) values (2,172,25019,'2016-07-01',NULL,'10.10','45555','JUUUJ','4555','HJJJJ',NULL,4);

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
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (175,'4','FONDOGAR SL','B81002057','2008-07-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1111','Pablito Ito','ariconta1');
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
  `codigoContable` int(11) DEFAULT NULL,
  PRIMARY KEY (`formaPagoId`),
  KEY `fkey_tipo_forma_pago` (`tipoFormaPagoId`),
  CONSTRAINT `fkey_tipo_forma_pago` FOREIGN KEY (`tipoFormaPagoId`) REFERENCES `tipos_forma_pago` (`tipoFormaPagoId`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8;

/*Data for the table `formas_pago` */

insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (1,0,'Efectivo',1,0,0,3);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (2,4,'RECIBO 30,60,90',3,30,30,NULL);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (4,0,'CONTADO',1,0,0,1);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (5,4,'EFECTO A 30 DIAS',1,30,0,2);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (6,1,'TRANSFERENCIA ANTICIPADA',1,1,NULL,3);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (7,1,'TRANSFERENCIA 30 DIAS F. ',1,30,0,4);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (8,4,'RECIBO A 30 DIAS',1,30,0,5);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (9,2,'TALON NOMINATIVO A 30 DIA',1,30,0,6);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (10,4,'RECIBO A LA VISTA',1,5,0,7);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (11,4,'EFECTO A 15 DIAS',1,15,0,8);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (12,1,'TRANSFERENCIA',1,0,0,9);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (13,2,'TALON NOMINATIVO',1,0,0,10);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (14,4,'RECIBO BANCARIO',1,14,0,11);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (15,4,'EFECTO A 30 Y 60 DIAS.',2,30,30,12);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (16,4,'10% ENTRADA + 10 MESES FI',10,30,30,13);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (17,4,'RECIBO A 45 DIAS',1,45,NULL,14);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (18,3,'PAGARE NO A LA ORDEN',1,0,0,15);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (19,3,'PAGARE VTO. 30 DIAS FECHA',1,30,0,16);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (20,4,'EFECTO BANCARIO, 30, 60, ',3,30,30,17);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (21,4,'EFECTO BANCARIO, 25, 50, ',3,25,25,18);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (22,4,'EFECTOS 30 ABRIL, MAYO Y ',3,8,30,19);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (23,4,'EFECTO A 20 DIAS.',1,20,0,20);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (24,4,'30% PEDIDO, RESTO A 30/60',4,7,30,21);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (25,5,'CONFIRMING',1,30,NULL,22);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (26,4,'RECIBO DOMICILIADO 10 MEN',10,30,30,23);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (27,1,'50% PEDIDO, 50% INSTALACI',2,0,15,24);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (28,5,'CONFIRMING A 120 DIAS',1,120,NULL,25);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (29,0,'VER OBSERVACIONES',1,30,NULL,26);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (30,4,'RECIBO DOMIC. 10 DIAS/ 30',2,15,30,27);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (31,4,'GIRO BANCARIO 6 VTOS.',6,30,30,28);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (32,4,'50 % RECIBO / 50% GIRO 30',2,10,30,29);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (33,3,'PAGARE - 4 VENCIMIENTOS',4,10,30,30);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (34,4,'RECIBO DOMICILIADO 20 DIA',1,20,NULL,31);

/*Table structure for table `grupo_articulo` */

DROP TABLE IF EXISTS `grupo_articulo`;

CREATE TABLE `grupo_articulo` (
  `grupoArticuloId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`grupoArticuloId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `grupo_articulo` */

insert  into `grupo_articulo`(`grupoArticuloId`,`nombre`) values (3,'Capitulo de obras');
insert  into `grupo_articulo`(`grupoArticuloId`,`nombre`) values (4,'Capitulo Mantenimiento');

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
  `margenMantenimiento` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`parametroId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `parametros` */

insert  into `parametros`(`parametroId`,`articuloMantenimiento`,`margenMantenimiento`) values (0,2,'20.30');

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
  CONSTRAINT `pref_clientes` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `pref_contratos` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `pref_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `pref_formas_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas` */

insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (26,2016,NULL,NULL,'2016-03-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (27,2016,NULL,NULL,'2016-02-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (28,2016,NULL,NULL,'2016-01-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (29,2016,NULL,NULL,'2016-04-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (30,2016,NULL,NULL,'2016-05-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (31,2016,NULL,NULL,'2016-06-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (32,2016,NULL,NULL,'2016-07-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (33,2016,NULL,NULL,'2016-08-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (34,2016,NULL,NULL,'2016-09-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (35,2016,NULL,NULL,'2016-10-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (36,2016,NULL,NULL,'2016-11-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (37,2016,NULL,NULL,'2016-12-01',172,25020,29,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','125.00','151.25',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (135,2016,NULL,NULL,'2016-09-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (136,2016,NULL,NULL,'2016-10-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (137,2016,NULL,NULL,'2016-11-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (138,2016,NULL,NULL,'2016-12-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (139,2017,NULL,NULL,'2017-01-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (140,2017,NULL,NULL,'2017-02-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (141,2017,NULL,NULL,'2017-03-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (142,2017,NULL,NULL,'2017-04-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (143,2017,NULL,NULL,'2017-05-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (144,2017,NULL,NULL,'2017-06-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (145,2017,NULL,NULL,'2017-07-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (146,2017,NULL,NULL,'2017-08-04',175,25020,38,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','20.83','25.20',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (147,2016,NULL,NULL,'2016-10-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (148,2016,NULL,NULL,'2016-11-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (149,2016,NULL,NULL,'2016-09-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (150,2016,NULL,NULL,'2016-12-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (151,2016,NULL,NULL,'2016-08-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (152,2017,NULL,NULL,'2017-04-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (153,2017,NULL,NULL,'2017-06-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (154,2017,NULL,NULL,'2017-02-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (155,2017,NULL,NULL,'2017-01-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (156,2017,NULL,NULL,'2017-03-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (157,2017,NULL,NULL,'2017-05-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (158,2017,NULL,NULL,'2017-07-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (159,2017,NULL,NULL,'2017-08-02',172,25020,28,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA','43.08','52.13',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (160,2016,NULL,NULL,'2016-08-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (161,2016,NULL,NULL,'2016-09-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (162,2016,NULL,NULL,'2016-10-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (163,2016,NULL,NULL,'2016-11-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (164,2016,NULL,NULL,'2016-12-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (165,2017,NULL,NULL,'2017-04-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (166,2017,NULL,NULL,'2017-01-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (167,2017,NULL,NULL,'2017-02-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (168,2017,NULL,NULL,'2017-03-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (169,2017,NULL,NULL,'2017-05-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (170,2017,NULL,NULL,'2017-06-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (171,2017,NULL,NULL,'2017-07-01',172,33870,27,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','A4555','Nombre del clientre',NULL,NULL,NULL,NULL,'100.00','121.00',1,NULL);

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
  CONSTRAINT `prefb_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `prefacturas` (`prefacturaId`) ON DELETE CASCADE,
  CONSTRAINT `prefb_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas_bases` */

insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (75,31,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (76,26,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (77,32,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (78,27,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (79,28,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (80,30,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (81,33,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (82,34,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (83,35,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (84,37,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (85,36,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (86,29,11,'21.00','125.00','26.25');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (111,142,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (112,137,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (113,135,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (114,140,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (115,141,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (116,139,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (117,138,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (118,143,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (119,145,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (120,136,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (121,146,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (122,144,11,'21.00','20.83','4.37');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (123,147,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (124,149,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (125,148,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (126,157,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (127,151,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (128,152,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (129,150,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (130,158,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (131,156,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (132,155,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (133,153,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (134,154,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (135,159,11,'21.00','43.08','9.05');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (136,165,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (137,160,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (138,162,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (139,164,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (140,163,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (141,167,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (142,171,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (143,166,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (144,168,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (145,170,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (146,169,11,'21.00','100.00','21.00');
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (147,161,11,'21.00','100.00','21.00');

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
  KEY `prefl_articulos` (`articuloId`),
  KEY `prefl_tipos_iva` (`tipoIvaId`),
  KEY `prefl_prefacturas` (`prefacturaId`),
  CONSTRAINT `prefl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `prefl_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `prefacturas` (`prefacturaId`) ON DELETE CASCADE,
  CONSTRAINT `prefl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas_lineas` */

insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (56,1,26,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (57,1,31,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (58,1,32,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (59,1,28,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (60,1,27,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (61,1,36,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (62,1,35,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (63,1,30,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (64,1,37,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (65,1,34,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (66,1,33,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (67,1,29,4,11,'21.00','Tipo de mantenimiento 1','1.00','125.00','125.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (92,1,137,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (93,1,135,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (94,1,142,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (95,1,140,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (96,1,139,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (97,1,141,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (98,1,138,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (99,1,143,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (100,1,136,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (101,1,145,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (102,1,146,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (103,1,144,2,11,'21.00','Mantenimiento general','1.00','20.83','20.83');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (104,1,147,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (105,1,150,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (106,1,148,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (107,1,149,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (108,1,157,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (109,1,158,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (110,1,152,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (111,1,151,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (112,1,153,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (113,1,154,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (114,1,155,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (115,1,156,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (116,1,159,3,11,'21.00','Articulo para pruebas','1.00','43.08','43.08');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (117,1,160,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (118,1,162,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (119,1,167,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (120,1,164,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (121,1,163,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (122,1,165,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (123,1,166,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (124,1,168,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (125,1,161,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (126,1,170,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (127,1,169,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (128,1,171,6,11,'21.00','Mantenimiento de ascensores','1.00','100.00','100.00');

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
insert  into `tipos_comerciales`(`tipoComercialId`,`nombre`) values (2,'COLABORADOR');

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

/*Data for the table `tipos_iva` */

insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (11,'IVA 21%','21.00',1);
insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (12,'IVA 10%','10.00',2);
insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (13,'IVA 4%','4.00',3);
insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (14,'EXENTO','0.00',4);

/*Table structure for table `unidades` */

DROP TABLE IF EXISTS `unidades`;

CREATE TABLE `unidades` (
  `unidadId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `abrev` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `unidades` */

insert  into `unidades`(`unidadId`,`nombre`,`abrev`) values (1,'metros','m');
insert  into `unidades`(`unidadId`,`nombre`,`abrev`) values (2,'kilogramos','kg');

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
