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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `articulos` */

insert  into `articulos`(`articuloId`,`grupoArticuloId`,`codigoBarras`,`nombre`,`precioUnitario`,`tipoIvaId`,`descripcion`,`unidadId`) values 
(1,6,NULL,'seguro comunidad',0.00,1,NULL,3);

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `clientes` */

insert  into `clientes`(`clienteId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`formaPagoId`,`observaciones`,`tipoClienteId`,`cuentaContable`,`iban`,`comercialId`,`cuentaCorriente`,`codigo`) values 
(6,'','C.P. PLAZA DE LEGAZPI 1  Y  BOLIVAR, 1','E78216900','2015-08-31 00:00:00',NULL,1,NULL,NULL,'LEGAZPI, 1  Y  BOLIVAR, 1','28045','MADRID','MADRID',NULL,NULL,NULL,NULL,NULL,7,NULL,0,'430000001','ES8400492666761910643890',NULL,NULL,1),
(7,'B0118/004','MAN. ALONSO ZAMORA VICENTE, 1','H85070449','2014-04-02 00:00:00',NULL,1,NULL,NULL,'ALONSO ZAMORA VICENTE, 1, PORTAL 1 AL 7','28702','SAN SEBASTIÁN DE LOS REYES','MADRID',NULL,NULL,NULL,NULL,NULL,7,NULL,0,'430000002','ES9520858223150330089707',33,NULL,2),
(9,'S0319/015','C.P. NARVÁEZ, 21','H-79230322','2013-10-14 00:00:00',NULL,1,NULL,NULL,'NARVÁEZ, 21','28009','MADRID','MADRID',NULL,NULL,NULL,NULL,NULL,7,NULL,0,'430000003','ES4100190324834010015262',NULL,NULL,3);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `clientes_comisionistas` */

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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

/*Data for the table `comerciales` */

insert  into `comerciales`(`comercialId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`email2`,`observaciones`,`tipoComercialId`,`formaPagoId`,`dniFirmante`,`firmante`,`ascComercialId`) values 
(33,NULL,'MARISA RAMIRO IGLESIAS','51891134y','2016-09-29 00:00:00',NULL,NULL,NULL,NULL,'INMACULADA CONCEPCIÓN 39','28019','madrid ','madrid ','695941897',NULL,NULL,'almaley.gestion@hotmail.com',NULL,NULL,1,NULL,NULL,NULL,34),
(34,'4','Trejo, Isabel','51871549v ','2001-02-22 00:00:00',NULL,1,NULL,NULL,'calle','28009','tres cantos','madrid','696914587',NULL,NULL,'itrejo@proasistencia.es',NULL,'',2,NULL,NULL,NULL,NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `contrato_cliente_mantenimiento` */

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `contrato_cliente_mantenimiento_comisionistas` */

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `contrato_comercial` */

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `contrato_mantenedor` */

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `empresas` */

insert  into `empresas`(`empresaId`,`proId`,`nombre`,`nif`,`fechaAlta`,`fechaBaja`,`activa`,`contacto1`,`contacto2`,`direccion`,`codPostal`,`poblacion`,`provincia`,`telefono1`,`telefono2`,`fax`,`email`,`observaciones`,`dniFirmante`,`firmante`,`contabilidad`) values 
(2,'1','PROASISTENCIA, S.L.','B81323180','2001-03-30 00:00:00',NULL,1,NULL,NULL,'CAMINO DE REJAS, 1','28820','COSLADA','MADRID',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ariconta11');

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `formas_pago` */

insert  into `formas_pago`(`formaPagoId`,`tipoFormaPagoId`,`nombre`,`numeroVencimientos`,`primerVencimiento`,`restoVencimiento`,`codigoContable`) values 
(6,0,'EFECTIVO',0,0,0,1),
(7,4,'RECIBO 10 DIAs',1,10,0,2);

/*Table structure for table `grupo_articulo` */

DROP TABLE IF EXISTS `grupo_articulo`;

CREATE TABLE `grupo_articulo` (
  `grupoArticuloId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`grupoArticuloId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

/*Data for the table `grupo_articulo` */

insert  into `grupo_articulo`(`grupoArticuloId`,`nombre`) values 
(6,'seguro anual');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `mantenedores` */

/*Table structure for table `parametros` */

DROP TABLE IF EXISTS `parametros`;

CREATE TABLE `parametros` (
  `parametroId` int(11) NOT NULL,
  `articuloMantenimiento` int(11) DEFAULT NULL,
  `margenMantenimiento` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`parametroId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `parametros` */

insert  into `parametros`(`parametroId`,`articuloMantenimiento`,`margenMantenimiento`) values 
(0,5,15.00);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas` */

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas_bases` */

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `prefacturas_lineas` */

/*Table structure for table `tipos_clientes` */

DROP TABLE IF EXISTS `tipos_clientes`;

CREATE TABLE `tipos_clientes` (
  `tipoClienteId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoClienteId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tipos_clientes` */

insert  into `tipos_clientes`(`tipoClienteId`,`nombre`) values 
(0,'NORMAL'),
(1,'MANTENEDOR');

/*Table structure for table `tipos_comerciales` */

DROP TABLE IF EXISTS `tipos_comerciales`;

CREATE TABLE `tipos_comerciales` (
  `tipoComercialId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoComercialId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tipos_comerciales` */

insert  into `tipos_comerciales`(`tipoComercialId`,`nombre`) values 
(1,'AGENTE'),
(2,'COMERCIAL'),
(3,'DIRECTOR COMERCIAL'),
(4,'MANTENIMIENTO'),
(5,'JEFE OBRAS'),
(6,'OFICINA TÉCNICA'),
(7,'ASESOR TÉCNICO');

/*Table structure for table `tipos_forma_pago` */

DROP TABLE IF EXISTS `tipos_forma_pago`;

CREATE TABLE `tipos_forma_pago` (
  `tipoFormaPagoId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoFormaPagoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tipos_forma_pago` */

insert  into `tipos_forma_pago`(`tipoFormaPagoId`,`nombre`) values 
(0,'EFECTIVO'),
(1,'TRANSFERENCIA'),
(2,'TALON'),
(3,'PAGARE'),
(4,'RECIBO BANCARIO'),
(5,'CONFIRMING'),
(6,'TARJETA CREDITO');

/*Table structure for table `tipos_iva` */

DROP TABLE IF EXISTS `tipos_iva`;

CREATE TABLE `tipos_iva` (
  `tipoIvaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `codigoContable` int(11) DEFAULT NULL,
  PRIMARY KEY (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `tipos_iva` */

insert  into `tipos_iva`(`tipoIvaId`,`nombre`,`porcentaje`,`codigoContable`) values 
(3,'21%',21.00,1);

/*Table structure for table `unidades` */

DROP TABLE IF EXISTS `unidades`;

CREATE TABLE `unidades` (
  `unidadId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `abrev` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `unidades` */

insert  into `unidades`(`unidadId`,`nombre`,`abrev`) values 
(2,'SEGUROS generali','GEN'),
(3,'seguro generali','GEN');

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

insert  into `usuarios`(`usuarioId`,`nombre`,`login`,`password`,`email`,`nivel`) values 
(6,'Administrador Principal','admin','admin','admin@gmail.com',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
