/*
SQLyog Community v12.2.6 (64 bit)
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
  CONSTRAINT `ref_art_grupo` FOREIGN KEY (`grupoArticuloId`) REFERENCES `grupo_articulo` (`grupoArticuloId`),
  CONSTRAINT `ref_art_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Data for the table `articulos` */

insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (2,NULL,NULL,'Mantenimiento general',0.00,7,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (3,NULL,NULL,'Articulo para pruebas',120.33,7,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (4,NULL,NULL,'MANTENIMIENTO LIMPIEZA ANUAL - BOLDANO, 41 - EJER. 2016/2017',1340.00,7,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (5,NULL,NULL,'ARRENDAMIENTO',600.00,7,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (6,NULL,NULL,'ADMINISTRACION DE FINCA AVDA DE AMERICA 16 MADRID',250.00,7,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (7,NULL,NULL,'FOTOCOPIAS',32.82,7,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (8,NULL,NULL,'SEGUROS',0.00,10,NULL,NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (9,3,NULL,'ARQUETA DE PASO DE 40X30',120.00,8,'Arqueta de paso de 40x40 cm.  con fondo hasta 60 cm. formada por fábrica de ladrillo perforado de 1/2 pie de espesor  recibido con mortero de cemento y arena de rio 1/6 enfoscada y bruñida interiormente. ',NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (10,1,NULL,'LIMPIEZA SEMANAL DE CRISTALES',32.00,7,'Limpieza semanal de cristales con productos adecuados, con parte proporcional de medios auxiliares de acceso a una altura inferior a 3 m.',NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (11,3,NULL,'MURO DE 1/2 PIE',80.00,8,'Muro de fabrica de ladrillo de 1/2 pie de espesor.',NULL);
insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values (12,4,NULL,'ARRENDAMIENTO OFICINA 2G MES EN CURSO',450.00,7,NULL,NULL);

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
  `cuentaCorriente` varchar(255) DEFAULT NULL,
  `codigo` int(11) DEFAULT NULL,
  PRIMARY KEY (`clienteId`),
  KEY `fkey_forma_pago` (`formaPagoId`),
  KEY `fkey_tipo_cliente` (`tipoClienteId`),
  CONSTRAINT `fkey_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `fkey_tipo_cliente` FOREIGN KEY (`tipoClienteId`) REFERENCES `tipos_clientes` (`tipoClienteId`)
) ENGINE=InnoDB AUTO_INCREMENT=25031 DEFAULT CHARSET=utf8;

/*Data for the table `clientes` */

insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values (25019,NULL,'MANTENIMIENTOS BUENOS S.A.','ASSS','2016-07-01 00:00:00',NULL,1,'Juan Martel',NULL,'Calle del Progreso','28080','Madrid','MADRID','916686888',NULL,NULL,'jm@gmail.com',NULL,6,'Es un mantenedor de prueba para ver como funciona',1,NULL,'ES6501822339600011500305',NULL,NULL,NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values (25020,'0','Casas del Mayorazgo','455578B','2016-01-01 00:00:00',NULL,1,NULL,NULL,'Calle del Mayorazgo N.27','46000','Valencia','VALENCIA',NULL,NULL,NULL,NULL,NULL,6,NULL,0,NULL,'ES6501822339600011500305',NULL,NULL,NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values (25021,'S0221/002','C.P. BOLDANO, 41 B','H79620563','2016-07-26 00:00:00',NULL,1,'MARISA (PRESIDENTA)',NULL,'CALLE BOLDANO, 41 A','28027','MADRID','MADRID','687955904',NULL,NULL,'m.orozco.amoros@gmail.com',NULL,23,NULL,0,NULL,'ES6300810134910001475148',6,NULL,NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values (25022,'1900006','MARIA DEL CARMEN DIEZ','10177285S','2016-07-26 00:00:00',NULL,1,'MARICARMEN',NULL,'ALCALDE JOSE ARANDA, 12','28923','ALCORCON','MADRID','637736972',NULL,NULL,'midlimpiezas@hotmail.com',NULL,23,NULL,1,NULL,'00751094960700041438',NULL,NULL,NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values (25023,NULL,'MUTUA PROPIETARIOS SEGUROS Y REASEGUROS A PRIMA FIJA','G08171332','2016-07-25 00:00:00',NULL,1,'Daniel Cañete',NULL,'C/ LONDRES 29','08029','Barcelona ','Barcelona ','934873020 ext.253','663750643',NULL,'daniel.canete@mutuapropietarios.es',NULL,6,'Fondogar es agente exclusivo de esta CIA',1,NULL,'ES4920381954262690002880',NULL,NULL,NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values (25025,NULL,'MOTORPRES IBERICA SL','A79088159','2016-08-01 00:00:00',NULL,1,'JULIO RODRIGUEZ',NULL,'TRAVESIA DE LA PONTEZUELA Nº 10 PLANTA BAJA','28470','CERCEDILLA','MADRID','918520422',NULL,NULL,NULL,NULL,17,NULL,0,NULL,'ES5621001417170100133844',NULL,NULL,NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values (25026,'12','C.P. AVDA DE AMERICA 16 MADRID','E81323180','2016-08-01 00:00:00',NULL,1,'ISABEL PRESIDENTA',NULL,'AVENIDA DE AMÉRICA Nº 16 PLANTA 1º  IZQUIERDA','28028','MADRID','MADRID','918560294',NULL,NULL,NULL,NULL,23,NULL,0,NULL,'ES9121000418450200051332',6,NULL,NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values (25027,'K0001/028','C.P. VIRTUDES, 13','H82409525','2015-01-23 00:00:00',NULL,1,NULL,NULL,'VIRTUDES, 13','28010','MADRID','MADRID',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,'52525626265262652',6,NULL,NULL);
insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values (25030,'K0001/013','C.P. AVENIDA DE AMÉRICA, 4','E-78756384','2013-10-30 00:00:00',NULL,1,NULL,NULL,'AVENIDA DE AMÉRICA, 4','28028','MADRID','MADRID',NULL,NULL,NULL,NULL,NULL,NULL,'12-11-15 cambian ccc 2100-2070-08-0200016585',0,NULL,'es0000000000000000000000',NULL,NULL,NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `clientes_comisionistas` */

insert  into `clientes_comisionistas`(`clienteComisionistaId`,`clienteId`,`comercialId`,`manPorVentaNeta`,`manPorBeneficio`) values (1,25021,6,10.00,11.00);

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
  `ascComercialId` int(11) DEFAULT NULL COMMENT 'Comercial asociado, en el caso de los agentes el comercial del que dependen.',
  PRIMARY KEY (`comercialId`),
  KEY `fkey_comercial_forma_pago` (`formaPagoId`),
  KEY `fkey_comercial_comercial` (`ascComercialId`),
  CONSTRAINT `fkey_comercial_comercial` FOREIGN KEY (`ascComercialId`) REFERENCES `comerciales` (`comercialId`),
  CONSTRAINT `fkey_comercial_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

/*Data for the table `comerciales` */

insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (4,'1','Proasistencia',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (5,'2','Tortajada Fenollera, Juan',NULL,'2000-11-08 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jtortajada@proasistencia.es',NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (6,'3','Anabel','456666','2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',1,NULL,NULL,NULL,7);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (7,'4','Trejo, Isabel',NULL,'2001-02-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (8,'5','Alvarez Linera, Jorge','A45555','2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',3,17,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (9,'6','Coma, Liliana',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (10,'7','Ortega Viota',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (11,'8','Cocero, Sara',NULL,'2001-02-22 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (12,'9','Cristina Moreno',NULL,'2005-06-09 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (13,'10','Javier Longo',NULL,'2006-07-31 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (14,'11','Eduardo Chinarro',NULL,'2008-10-07 00:00:00',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (15,'16','Eduardo Fauquie',NULL,'2009-04-02 17:02:21',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (17,'20','Oscar Bermejo',NULL,'2011-04-13 16:39:07',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (18,'27','Jose Luis Cuevas',NULL,'2011-11-14 09:57:53',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (19,'29','CLIENTE PASADO A JOSE LUIS',NULL,'2012-01-30 17:59:10',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (20,'30','CLIENTE PASADO A ISABEL',NULL,'2012-01-30 17:59:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (21,'31','Rosa Carpintero',NULL,'2012-12-03 10:50:30',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (22,'32','OSCAR VARAS',NULL,'2013-10-29 11:07:50',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (23,'33','VICTOR MANUEL',NULL,'2014-01-20 12:57:27',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (24,'34','CLIENTE PASADO DE JUAN A ISABEL',NULL,'2014-02-25 14:11:06',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (25,'36','Lourdes',NULL,'2014-10-14 16:57:16',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (26,'38','Cliente pasado de Juan a Lourdes',NULL,'2014-10-14 16:58:38',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (27,'39','Patricia','11111111A','2015-02-18 00:00:00',NULL,0,NULL,NULL,'ZZZZZZZZZZZZ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',4,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (28,'40','Clientes pasados a Patricia',NULL,'2015-02-18 12:25:40',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (29,'41','Sonia',NULL,'2015-04-13 11:27:17',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (30,NULL,'NOMBRE','1111111A','2016-07-28 00:00:00',NULL,1,NULL,NULL,'C/ DDDDD',NULL,NULL,NULL,NULL,NULL,NULL,'pmarina@comercializa.info',NULL,NULL,2,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (31,'1','ALBERTO PEREZ AAAAAAAAAA','00578238V','2016-08-01 00:00:00',NULL,1,'ALBERTO',NULL,'CALLE RIVERA AAAAA N 2  PISO 1B','28028','MADRID','MADRID','636263511',NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (32,'36','LOLA JIMENEZ','45856895A','2016-08-10 00:00:00',NULL,1,NULL,'Patricia','Camino de Rejas, 1','28821','Coslada','Madrid','913613848','913613848','913613848',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL);
insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values (33,'H114','YOLANDA BAYON DOMINGUEZ',NULL,'2000-01-01 00:00:00',NULL,1,NULL,NULL,'ANDRES MELLADO, 78 Bº IZQ. ESC.B','28015','MADRID','MADRID','915445024 637287814',NULL,'no tiene',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL);

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
  `impComer` decimal(10,2) DEFAULT NULL,
  `importeMantenedor` decimal(10,2) DEFAULT NULL,
  `fechaOriginal` date DEFAULT NULL,
  PRIMARY KEY (`contratoClienteMantenimientoId`),
  KEY `ref_ccm_empresa` (`empresaId`),
  KEY `ref_ccm_mantenedor` (`mantenedorId`),
  KEY `ref_ccm_cliente` (`clienteId`),
  KEY `ref_ccm_articulo` (`articuloId`),
  CONSTRAINT `ref_ccm_articulo` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `ref_ccm_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `ref_ccm_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `ref_ccm_mantenedor` FOREIGN KEY (`mantenedorId`) REFERENCES `clientes` (`clienteId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_cliente_mantenimiento` */

insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`,`impComer`,`importeMantenedor`,`fechaOriginal`) values (6,178,NULL,25020,'2016-01-01',NULL,1500.00,4,10.30,'OKKK',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`,`impComer`,`importeMantenedor`,`fechaOriginal`) values (9,175,25022,25021,'2016-07-26','2017-07-25',1340.00,4,10.00,NULL,NULL,100.00,10.00,10.00,110.00,NULL,5,121.00,NULL,11.00,21.00,NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`,`impComer`,`importeMantenedor`,`fechaOriginal`) values (10,179,NULL,25025,'2016-08-01','2017-07-31',7200.00,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`,`empresaId`,`mantenedorId`,`clienteId`,`fechaInicio`,`fechaFin`,`venta`,`tipoPago`,`manPorComer`,`observaciones`,`comercialId`,`coste`,`margen`,`beneficio`,`ventaNeta`,`manAgente`,`articuloId`,`importeAlCliente`,`referencia`,`impComer`,`importeMantenedor`,`fechaOriginal`) values (11,175,25023,25026,'2016-08-02','2017-08-01',3500.00,1,0.00,'Contrato prueba seguros',6,NULL,15.00,0.00,700.00,8.00,8,NULL,NULL,NULL,NULL,NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_cliente_mantenimiento_comisionistas` */

insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (1,6,21,10.20,NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (5,6,6,15.00,NULL);
insert  into `contrato_cliente_mantenimiento_comisionistas`(`contratoClienteMantenimientoComisionistaId`,`contratoClienteMantenimientoId`,`comercialId`,`porVentaNeta`,`porBeneficio`) values (8,11,31,10.00,NULL);

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
  `observaciones` text,
  `dniFirmanteEmpresa` varchar(255) DEFAULT NULL,
  `firmanteEmpresa` varchar(255) DEFAULT NULL,
  `dniFirmanteColaborador` varchar(255) DEFAULT NULL,
  `firmanteColaborador` varchar(255) DEFAULT NULL,
  `manComisAgente` tinyint(1) DEFAULT NULL,
  `manPorImpCliente` decimal(5,2) DEFAULT '0.00',
  `manPorImpClienteAgente` decimal(5,2) DEFAULT '0.00',
  `manPorCostes` decimal(5,2) DEFAULT '0.00',
  `manCostes` tinyint(1) DEFAULT NULL,
  `manJefeObra` tinyint(1) DEFAULT NULL,
  `manOficinaTecnica` tinyint(1) DEFAULT NULL,
  `manAsesorTecnico` tinyint(1) DEFAULT NULL,
  `manComercial` tinyint(1) DEFAULT NULL,
  `comision` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`contratoComercialId`),
  UNIQUE KEY `idx_empresa_comercial` (`empresaId`,`comercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_comercial` */

insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (3,175,6,'2016-06-18','2016-06-12',10,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (4,176,6,'2016-06-17','2016-06-25',10,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (5,178,31,'2016-08-01',NULL,24,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,1,10.00,0.00,0.00,0,0,0,0,0,10.00);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (7,177,8,'2016-08-12',NULL,6,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (8,172,31,'2016-08-01',NULL,24,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,1,10.00,0.00,0.00,0,0,0,0,0,10.00);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (9,173,31,'2016-08-01',NULL,24,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,1,10.00,0.00,0.00,0,0,0,0,0,10.00);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (10,174,31,'2016-08-01',NULL,24,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,1,10.00,0.00,0.00,0,0,0,0,0,10.00);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (11,175,31,'2016-08-01',NULL,24,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,1,10.00,0.00,0.00,0,0,0,0,0,10.00);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (12,176,31,'2016-08-01',NULL,24,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,1,10.00,0.00,0.00,0,0,0,0,0,10.00);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (13,177,31,'2016-08-01',NULL,24,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,1,10.00,0.00,0.00,0,0,0,0,0,10.00);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (14,179,31,'2016-08-01',NULL,24,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,1,10.00,0.00,0.00,0,0,0,0,0,10.00);
insert  into `contrato_comercial`(`contratoComercialId`,`empresaId`,`comercialId`,`fechaInicio`,`fechaFin`,`numMeses`,`tipoPago`,`importe`,`minimoMensual`,`observaciones`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteColaborador`,`firmanteColaborador`,`manComisAgente`,`manPorImpCliente`,`manPorImpClienteAgente`,`manPorCostes`,`manCostes`,`manJefeObra`,`manOficinaTecnica`,`manAsesorTecnico`,`manComercial`,`comision`) values (15,180,31,'2016-08-01',NULL,24,2,1250.00,1500.00,NULL,NULL,NULL,NULL,NULL,1,10.00,0.00,0.00,0,0,0,0,0,10.00);

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `contrato_mantenedor` */

insert  into `contrato_mantenedor`(`contratoMantenedorId`,`empresaId`,`clienteId`,`fechaInicio`,`fechaFin`,`manPorComer`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteMantenedor`,`firmanteMantenedor`,`observaciones`,`tipoPago`) values (2,175,25019,'2016-07-01',NULL,10.00,'45555','JUUUJ','4555','HJJJJ',NULL,4);
insert  into `contrato_mantenedor`(`contratoMantenedorId`,`empresaId`,`clienteId`,`fechaInicio`,`fechaFin`,`manPorComer`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteMantenedor`,`firmanteMantenedor`,`observaciones`,`tipoPago`) values (3,175,25022,'2016-07-16','2017-07-15',14.00,NULL,NULL,NULL,NULL,NULL,4);
insert  into `contrato_mantenedor`(`contratoMantenedorId`,`empresaId`,`clienteId`,`fechaInicio`,`fechaFin`,`manPorComer`,`dniFirmanteEmpresa`,`firmanteEmpresa`,`dniFirmanteMantenedor`,`firmanteMantenedor`,`observaciones`,`tipoPago`) values (4,175,25023,'2016-06-01',NULL,20.00,NULL,NULL,NULL,NULL,NULL,3);

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
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8;

/*Data for the table `empresas` */

insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (172,'1','PROASISTENCIA, S.L.','B81323180','2001-03-30 00:00:00',NULL,1,NULL,NULL,'CAMINO DE REJAS, 1','28820','COSLADA','MADRID',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ariconta11');
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (173,'2','Román Alonso García','00676698S','2001-10-10 00:00:00',NULL,1,NULL,NULL,'AVENIDA AMERICA, 16','28028','MADRID','MADRID',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (174,'3','OBRAS',NULL,'2001-10-10 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (175,'4','FONDOGAR SL','B81002057','2008-07-22 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1111','Pablito Ito','ariconta13');
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (176,'5','GRUPO INMOBILIARIO METROPOLITANO S.A.','A79088159','0001-01-01 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (177,'6','REABITA OBRAS DE REHABILITACION S.L.','B85983054','0001-01-01 00:00:00',NULL,1,NULL,NULL,'REAL, 1 - Nº8 1ºD','28460','LOS MOLINOS','MADRID',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (178,'7','SIERRA DE GUADARRAMA, C.B.','E82315227','0001-01-01 00:00:00',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (179,NULL,'GRUPO INMOBILIARIO METROPOLITANO S.A.','A79088159','0016-07-29 00:00:00',NULL,1,'ROSA FARRERA',NULL,'AVENIDA DE AMÉRICA Nº 16 PLANTA 1º  IZQUIERDA','28028','MADRID','MADRID','913613601',NULL,NULL,'ralonso@proasistencia.es',NULL,'00676698S','ROMAN ALONSO GARCIA',NULL);
insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values (180,'21*0024','ADMINISTRADORES DE FINCAS REDFINCAS SL','B81328190','2016-08-01 00:00:00',NULL,1,'LEOPOLDO',NULL,'AVENIDA DE AMÉRICA Nº 16 PLANTA 1º  IZQUIERDA','28028','MADRID','MADRID','917255401',NULL,NULL,'RALONSO@REDFINCAS.ES',NULL,NULL,NULL,NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

/*Data for the table `formas_pago` */

insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (6,0,'CONTADO',1,0,0,1);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (7,4,'EFECTO A 30 DIAS',1,30,0,2);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (8,1,'TRANSFERENCIA ANTICIPADA',1,1,NULL,3);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (9,1,'TRANSFERENCIA 30 DIAS F. ',1,30,0,4);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (10,4,'RECIBO A 30 DIAS',1,30,0,5);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (11,2,'TALON NOMINATIVO A 30 DIA',1,30,0,6);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (12,4,'RECIBO A LA VISTA',1,5,0,7);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (13,4,'EFECTO A 15 DIAS',1,15,0,8);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (14,1,'TRANSFERENCIA',1,0,0,9);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (15,2,'TALON NOMINATIVO',1,0,0,10);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (16,4,'RECIBO BANCARIO',1,14,0,11);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (17,4,'EFECTO A 30 Y 60 DIAS.',2,30,30,12);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (18,4,'10% ENTRADA + 10 MESES FI',10,30,30,13);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (19,4,'RECIBO A 45 DIAS',1,45,NULL,14);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (20,3,'PAGARE NO A LA ORDEN',1,0,0,15);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (21,3,'PAGARE VTO. 30 DIAS FECHA',1,30,0,16);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (22,4,'EFECTO BANCARIO, 30, 60, ',3,30,30,17);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (23,4,'EFECTO BANCARIO, 25, 50, ',3,25,25,18);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (24,4,'EFECTOS 30 ABRIL, MAYO Y ',3,8,30,19);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (25,4,'EFECTO A 20 DIAS.',1,20,0,20);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (26,4,'30% PEDIDO, RESTO A 30/60',4,7,30,21);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (27,5,'CONFIRMING',1,30,NULL,22);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (28,4,'RECIBO DOMICILIADO 10 MEN',10,30,30,23);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (29,1,'50% PEDIDO, 50% INSTALACI',2,0,15,24);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (30,5,'CONFIRMING A 120 DIAS',1,120,NULL,25);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (31,0,'VER OBSERVACIONES',1,30,NULL,26);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (32,4,'RECIBO DOMIC. 10 DIAS/ 30',2,15,30,27);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (33,4,'GIRO BANCARIO 6 VTOS.',6,30,30,28);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (34,4,'50 % RECIBO / 50% GIRO 30',2,10,30,29);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (35,3,'PAGARE - 4 VENCIMIENTOS',4,10,30,30);
insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values (36,4,'RECIBO DOMICILIADO 20 DIA',1,20,NULL,31);

/*Table structure for table `grupo_articulo` */

DROP TABLE IF EXISTS `grupo_articulo`;

CREATE TABLE `grupo_articulo` (
  `grupoArticuloId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`grupoArticuloId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `grupo_articulo` */

insert  into `grupo_articulo`(`grupoArticuloId`,`nombre`) values (1,'LIMPIEZA');
insert  into `grupo_articulo`(`grupoArticuloId`,`nombre`) values (3,'ALBAÑILERIA');
insert  into `grupo_articulo`(`grupoArticuloId`,`nombre`) values (4,'ARRENDAMIENTO DE INMUEBLES');

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

insert  into `mantenedores`(`mantenedorId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`formaPagoId`,`observaciones`) values (179,'45','El nombre','A45555','2016-02-01 00:00:00',NULL,NULL,'Persona 1','Persona 2','La dirección','46000','La población','Valencia','9644555455','696666666','7878999','pepe@pepe.com',17,'Y este es el campo de observaciones');
insert  into `mantenedores`(`mantenedorId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`formaPagoId`,`observaciones`) values (180,'1444','Juan','A45566',NULL,NULL,NULL,NULL,'Rafael Garcia','Calle Uruguay N.11 Oficina 101','46007','Valencia','-- Non U.S. --','4963805579','4963805579',NULL,'rafa@myariadna.com',6,NULL);

/*Table structure for table `parametros` */

DROP TABLE IF EXISTS `parametros`;

CREATE TABLE `parametros` (
  `parametroId` int(11) NOT NULL,
  `articuloMantenimiento` int(11) DEFAULT NULL,
  `margenMantenimiento` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`parametroId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `parametros` */

insert  into `parametros`(`parametroId`,`articuloMantenimiento`,`margenMantenimiento`) values (0,5,15.00);

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas` */

insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (2,NULL,NULL,NULL,'2016-01-01',172,25019,NULL,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','ASSS','MANTENIMIENTOS BUENOS S.A.','Calle del Progreso','28080','Madrid','MADRID',2165.94,2620.79,6,'Una lista de observaciones');
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (4,NULL,NULL,NULL,'2016-06-01',176,25020,NULL,'A79088159','GRUPO INMOBILIARIO METROPOLITANO S.A.',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA',1814.29,1866.79,6,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (5,NULL,NULL,NULL,'2016-06-01',176,25020,NULL,'A79088159','GRUPO INMOBILIARIO METROPOLITANO S.A.',NULL,NULL,NULL,NULL,'455578B','Casas del Mayorazgo','Calle del Mayorazgo N.27','46000','Valencia','VALENCIA',1500.00,1815.00,6,'Esta tiene líneas (ahora si)');
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (6,NULL,NULL,NULL,'2016-07-20',172,25019,NULL,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','ASSS','MANTENIMIENTOS BUENOS S.A.','Calle del Progreso','28080','Madrid','MADRID',4583.00,5545.43,6,'Para compensar mantenimientos no pagados');
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (8,NULL,NULL,NULL,'2016-07-26',175,25022,NULL,'B81002057','FONDOGAR SL',NULL,NULL,NULL,NULL,'10177285S','MARIA DEL CARMEN DIEZ','ALCALDE JOSE ARANDA, 12','28923','ALCORCON','MADRID',0.00,0.00,23,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (9,NULL,NULL,NULL,'2016-07-28',172,25021,NULL,'B81323180','PROASISTENCIA, S.L.','CAMINO DE REJAS, 1','28820','COSLADA','MADRID','H79620563','C.P. BOLDANO, 41','CALLE BOLDANO, 41','28027','MADRID','MADRID',300.00,330.00,23,NULL);
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (10,NULL,NULL,NULL,'2016-08-01',179,25025,NULL,'A79088159','GRUPO INMOBILIARIO METROPOLITANO S.A.','AVENIDA DE AMÉRICA Nº 16 PLANTA 1º  IZQUIERDA','280228','MADRID','MADRID','A79088159','MOTORPRES IBERICA SL','TRAVESIA DE LA PONTEZUELA Nº 10 PLANTA BAJA','28470','CERCEDILLA','MADRID',600.00,726.00,23,'Esta factura carece de valor sin el justificante de pago\n');
insert  into `prefacturas`(`prefacturaId`,`ano`,`numero`,`serie`,`fecha`,`empresaId`,`clienteId`,`contratoClienteMantenimientoId`,`emisorNif`,`emisorNombre`,`emisorDireccion`,`emisorCodPostal`,`emisorPoblacion`,`emisorProvincia`,`receptorNif`,`receptorNombre`,`receptorDireccion`,`receptorCodPostal`,`receptorPoblacion`,`receptorProvincia`,`total`,`totalConIva`,`formaPagoId`,`observaciones`) values (11,NULL,NULL,NULL,'2016-08-01',180,25026,NULL,'B81328190','ADMINISTRADORES DE FINCAS REDFINCAS SL','AVENIDA DE AMÉRICA Nº 16 PLANTA 1º  IZQUIERDA','28028','MADRID','MADRID','E81323180','C.P. AVDA DE AMERICA 16 MADRID','AVENIDA DE AMÉRICA Nº 16 PLANTA 1º  IZQUIERDA','28028','MADRID','MADRID',0.00,0.00,23,NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas_bases` */

insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (50,2,7,21.00,2165.94,454.85);
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (53,4,10,0.00,1564.29,0.00);
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (54,4,7,21.00,250.00,52.50);
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (56,5,7,21.00,1500.00,315.00);
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (57,6,7,21.00,4583.00,962.43);
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (59,9,8,10.00,300.00,30.00);
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (60,10,7,21.00,600.00,126.00);
insert  into `prefacturas_bases`(`prefacturaBaseId`,`prefacturaId`,`tipoIvaId`,`porcentaje`,`base`,`cuota`) values (62,11,7,21.00,282.82,59.39);

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
  CONSTRAINT `prefl_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `prefacturas` (`prefacturaId`) ON DELETE CASCADE,
  CONSTRAINT `prefl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas_lineas` */

insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (28,1,2,3,7,21.00,'Articulo para pruebas',1.00,120.33,120.33);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (30,2,2,3,7,21.00,'Articulo para pruebas',1.00,120.33,120.33);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (31,3,2,3,7,21.00,'Cambiamos la descripción',16.00,120.33,1925.28);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (32,1,4,2,7,21.00,'Mantenimiento general',1.00,250.00,250.00);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (33,2,4,3,10,0.00,'Articulo para pruebas',13.00,120.33,1564.29);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (34,1,5,2,7,21.00,'Mantenimiento general',1.00,1500.00,1500.00);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (35,1,6,2,7,21.00,'Mantenimiento general',1.00,4583.00,4583.00);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (37,1,9,3,8,10.00,'Articulo para pruebas',2.00,150.00,300.00);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (38,1,10,5,7,21.00,'ARRENDAMIENTO MES EN CURSO',1.00,600.00,600.00);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (39,1,11,6,7,21.00,'ADMINISTRACION DE FINCA AVDA DE AMERICA 16 MADRID',1.00,250.00,250.00);
insert  into `prefacturas_lineas`(`prefacturaLineaId`,`linea`,`prefacturaId`,`articuloId`,`tipoIvaId`,`porcentaje`,`descripcion`,`cantidad`,`importe`,`totalLinea`) values (40,2,11,7,7,21.00,'FOTOCOPIAS',1.00,32.82,32.82);

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `tipos_iva` */

insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (7,'IVA 21%',21.00,1);
insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (8,'IVA 10%',10.00,2);
insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (9,'IVA 4%',4.00,3);
insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values (10,'EXENTO',0.00,4);

/*Table structure for table `unidades` */

DROP TABLE IF EXISTS `unidades`;

CREATE TABLE `unidades` (
  `unidadId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `abrev` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`unidadId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `unidades` */

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `usuarios` */

insert  into `usuarios`(`usuarioId`,`nombre`,`login`,`password`,`email`,`nivel`) values (6,'Administrador Principal','admin','admin','admin@gmail.com',0);
insert  into `usuarios`(`usuarioId`,`nombre`,`login`,`password`,`email`,`nivel`) values (7,'PATRICIA','PATRI','marin@','pmarina@comercializa.info',1);
insert  into `usuarios`(`usuarioId`,`nombre`,`login`,`password`,`email`,`nivel`) values (9,'MARIA GARCIA','maria','maria','gestion.seguro.clientes@gmail.com',0);
insert  into `usuarios`(`usuarioId`,`nombre`,`login`,`password`,`email`,`nivel`) values (10,'ROMAN','RALONSO@PROASISTENCIA.ES','1234','RALONSO@PROASISTENCIA.ES',0);
insert  into `usuarios`(`usuarioId`,`nombre`,`login`,`password`,`email`,`nivel`) values (11,'Lola','lola','lola','lola@lola.es',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
