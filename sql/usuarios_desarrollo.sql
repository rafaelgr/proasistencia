/*
SQLyog Community v12.3.2 (64 bit)
MySQL - 5.7.14-log : Database - usuarios
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`usuarios` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `usuarios`;

/*Table structure for table `empresasariconta` */

DROP TABLE IF EXISTS `empresasariconta`;

CREATE TABLE `empresasariconta` (
  `codempre` smallint(4) NOT NULL DEFAULT '0',
  `nomempre` char(50) NOT NULL DEFAULT '',
  `nomresum` char(15) NOT NULL DEFAULT '',
  `Conta` char(10) DEFAULT NULL,
  `Tesor` tinyint(4) DEFAULT '0' COMMENT '0=solo contabilidad / 1=todo / 2=solo tesoreria',
  PRIMARY KEY (`codempre`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `empresasariconta` */

insert  into `empresasariconta`(`codempre`,`nomempre`,`nomresum`,`Conta`,`Tesor`) values (11,'La buena, no borrar','BUENA','ariconta11',1);

/*Table structure for table `pcs` */

DROP TABLE IF EXISTS `pcs`;

CREATE TABLE `pcs` (
  `codpc` smallint(5) unsigned NOT NULL DEFAULT '0',
  `nompc` char(30) DEFAULT NULL,
  `Conta` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`codpc`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `pcs` */

insert  into `pcs`(`codpc`,`nompc`,`Conta`) values (1,'PCDAVID',NULL);
insert  into `pcs`(`codpc`,`nompc`,`Conta`) values (2,'DESKTOP-GE1A5VA',NULL);

/*Table structure for table `usuarioempresasariconta` */

DROP TABLE IF EXISTS `usuarioempresasariconta`;

CREATE TABLE `usuarioempresasariconta` (
  `codusu` smallint(1) unsigned NOT NULL DEFAULT '0',
  `codempre` smallint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`codusu`,`codempre`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `usuarioempresasariconta` */

/*Table structure for table `usuarios` */

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `codusu` smallint(1) unsigned NOT NULL DEFAULT '0',
  `nomusu` char(30) NOT NULL DEFAULT '',
  `dirfich` char(255) DEFAULT NULL,
  `nivelusu` tinyint(1) NOT NULL DEFAULT '-1',
  `login` char(20) NOT NULL DEFAULT '',
  `passwordpropio` char(20) NOT NULL DEFAULT '',
  `nivelusuges` tinyint(4) NOT NULL DEFAULT '-1',
  `nivelariges` tinyint(4) NOT NULL DEFAULT '-1',
  `nivelsumi` tinyint(4) DEFAULT '-1',
  `nivelpres` tinyint(4) DEFAULT '-1',
  `niveloli` tinyint(4) NOT NULL DEFAULT '-1',
  `nivelariagro` tinyint(4) DEFAULT '-1',
  `skin` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`codusu`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `usuarios` */

insert  into `usuarios`(`codusu`,`nomusu`,`dirfich`,`nivelusu`,`login`,`passwordpropio`,`nivelusuges`,`nivelariges`,`nivelsumi`,`nivelpres`,`niveloli`,`nivelariagro`,`skin`) values (0,'Administrador',NULL,0,'root','aritel',1,0,0,0,0,0,2);
insert  into `usuarios`(`codusu`,`nomusu`,`dirfich`,`nivelusu`,`login`,`passwordpropio`,`nivelusuges`,`nivelariges`,`nivelsumi`,`nivelpres`,`niveloli`,`nivelariagro`,`skin`) values (1,'David Gandul Castells','',1,'David','1234',-1,1,-1,1,1,-1,2);

/*Table structure for table `vbloqbd` */

DROP TABLE IF EXISTS `vbloqbd`;

CREATE TABLE `vbloqbd` (
  `codusu` mediumint(5) unsigned NOT NULL DEFAULT '0',
  `conta` char(30) DEFAULT NULL,
  PRIMARY KEY (`codusu`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `vbloqbd` */

/*Table structure for table `wasientos` */

DROP TABLE IF EXISTS `wasientos`;

CREATE TABLE `wasientos` (
  `Lugar` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `codigo` smallint(1) NOT NULL DEFAULT '0',
  `numdiari` char(10) DEFAULT NULL,
  `fechaent` char(10) DEFAULT NULL,
  `numasien` char(11) DEFAULT NULL,
  `linliapu` char(10) DEFAULT NULL,
  `codmacta` char(10) DEFAULT NULL,
  `iddebhab` char(1) DEFAULT NULL,
  `numdocum` char(10) DEFAULT NULL,
  `codconce` char(10) DEFAULT NULL,
  `ampconce` char(30) DEFAULT NULL,
  `ctacontr` char(10) DEFAULT NULL,
  `codccost` char(10) DEFAULT NULL,
  `idcontab` char(6) DEFAULT NULL,
  `importe` char(12) DEFAULT NULL,
  `nommacta1` char(30) DEFAULT NULL,
  `nommacta2` char(30) DEFAULT NULL,
  `Observa` char(250) DEFAULT NULL,
  `correcto` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`codigo`,`Lugar`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wasientos` */

insert  into `wasientos`(`Lugar`,`codigo`,`numdiari`,`fechaent`,`numasien`,`linliapu`,`codmacta`,`iddebhab`,`numdocum`,`codconce`,`ampconce`,`ctacontr`,`codccost`,`idcontab`,`importe`,`nommacta1`,`nommacta2`,`Observa`,`correcto`) values (9,1,'1','2008-11-06','0','1','9360900000','D','','33','-3011006','9430120000','','ta202','11,74','','','',0);
insert  into `wasientos`(`Lugar`,`codigo`,`numdiari`,`fechaent`,`numasien`,`linliapu`,`codmacta`,`iddebhab`,`numdocum`,`codconce`,`ampconce`,`ctacontr`,`codccost`,`idcontab`,`importe`,`nommacta1`,`nommacta2`,`Observa`,`correcto`) values (9,2,'1','2008-11-06','0','2','9360910000','D','','33','-3011006','9430130000','','ta202','1,84','','','',0);
insert  into `wasientos`(`Lugar`,`codigo`,`numdiari`,`fechaent`,`numasien`,`linliapu`,`codmacta`,`iddebhab`,`numdocum`,`codconce`,`ampconce`,`ctacontr`,`codccost`,`idcontab`,`importe`,`nommacta1`,`nommacta2`,`Observa`,`correcto`) values (9,3,'1','2008-11-06','0','3','9430120000','H','','33','-3011006','9360900000','','ta202','11,74','','','',0);
insert  into `wasientos`(`Lugar`,`codigo`,`numdiari`,`fechaent`,`numasien`,`linliapu`,`codmacta`,`iddebhab`,`numdocum`,`codconce`,`ampconce`,`ctacontr`,`codccost`,`idcontab`,`importe`,`nommacta1`,`nommacta2`,`Observa`,`correcto`) values (9,4,'1','2008-11-06','0','4','9430130000','H','','33','-3011006','9360910000','','ta202','1,84','','','',0);
insert  into `wasientos`(`Lugar`,`codigo`,`numdiari`,`fechaent`,`numasien`,`linliapu`,`codmacta`,`iddebhab`,`numdocum`,`codconce`,`ampconce`,`ctacontr`,`codccost`,`idcontab`,`importe`,`nommacta1`,`nommacta2`,`Observa`,`correcto`) values (9,5,'9','2008-11-07','0','1','9360840000','D','','33','-3011006','9430070000','','ta202','2,83','','','',0);
insert  into `wasientos`(`Lugar`,`codigo`,`numdiari`,`fechaent`,`numasien`,`linliapu`,`codmacta`,`iddebhab`,`numdocum`,`codconce`,`ampconce`,`ctacontr`,`codccost`,`idcontab`,`importe`,`nommacta1`,`nommacta2`,`Observa`,`correcto`) values (9,6,'9','2008-11-07','0','2','9430070000','H','','33','-3011006','9360840000','','ta202','2,83','','','',0);
insert  into `wasientos`(`Lugar`,`codigo`,`numdiari`,`fechaent`,`numasien`,`linliapu`,`codmacta`,`iddebhab`,`numdocum`,`codconce`,`ampconce`,`ctacontr`,`codccost`,`idcontab`,`importe`,`nommacta1`,`nommacta2`,`Observa`,`correcto`) values (9,7,'52','2008-11-07','0','1','9999999999','D','','1','001001061200097','9999999999','','ta202','10,00','','','',6);
insert  into `wasientos`(`Lugar`,`codigo`,`numdiari`,`fechaent`,`numasien`,`linliapu`,`codmacta`,`iddebhab`,`numdocum`,`codconce`,`ampconce`,`ctacontr`,`codccost`,`idcontab`,`importe`,`nommacta1`,`nommacta2`,`Observa`,`correcto`) values (9,8,'52','2008-11-08','0','2','9999999999','H','','1','001001071200097','9999999999','','ta202','10,00','','','',6);

/*Table structure for table `wcabfact` */

DROP TABLE IF EXISTS `wcabfact`;

CREATE TABLE `wcabfact` (
  `lugar` tinyint(4) NOT NULL DEFAULT '0',
  `numserie` char(1) NOT NULL DEFAULT '',
  `codfaccl` int(11) NOT NULL DEFAULT '0',
  `fecfaccl` date NOT NULL DEFAULT '0000-00-00',
  `codmacta` varchar(10) NOT NULL DEFAULT '',
  `anofaccl` smallint(6) NOT NULL DEFAULT '0',
  `confaccl` varchar(15) DEFAULT NULL,
  `pi1faccl` decimal(6,2) DEFAULT NULL,
  `pi2faccl` decimal(6,2) DEFAULT NULL,
  `pi3faccl` decimal(6,2) DEFAULT NULL,
  `pr1faccl` decimal(6,2) DEFAULT NULL,
  `pr2faccl` decimal(6,2) DEFAULT NULL,
  `pr3faccl` decimal(6,2) DEFAULT NULL,
  `tp1faccl` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `tp2faccl` tinyint(3) unsigned DEFAULT NULL,
  `tp3faccl` tinyint(3) unsigned DEFAULT NULL,
  `intracom` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `ba1faccl` decimal(12,2) NOT NULL DEFAULT '0.00',
  `ba2faccl` decimal(12,2) DEFAULT NULL,
  `ba3faccl` decimal(12,2) DEFAULT NULL,
  `ti1faccl` decimal(12,2) DEFAULT NULL,
  `ti2faccl` decimal(12,2) DEFAULT NULL,
  `ti3faccl` decimal(12,2) DEFAULT NULL,
  `tr1faccl` decimal(12,2) DEFAULT NULL,
  `tr2faccl` decimal(12,2) DEFAULT NULL,
  `tr3faccl` decimal(12,2) DEFAULT NULL,
  `totfaccl` decimal(14,2) DEFAULT NULL,
  `retfaccl` decimal(6,2) DEFAULT NULL,
  `trefaccl` decimal(12,2) DEFAULT NULL,
  `cuereten` varchar(10) DEFAULT NULL,
  `nommacta` varchar(30) DEFAULT NULL,
  `fecliqcl` date DEFAULT NULL,
  `SeContabiliza` char(1) DEFAULT NULL,
  `correcto` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`lugar`,`numserie`,`codfaccl`,`anofaccl`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wcabfact` */

insert  into `wcabfact`(`lugar`,`numserie`,`codfaccl`,`fecfaccl`,`codmacta`,`anofaccl`,`confaccl`,`pi1faccl`,`pi2faccl`,`pi3faccl`,`pr1faccl`,`pr2faccl`,`pr3faccl`,`tp1faccl`,`tp2faccl`,`tp3faccl`,`intracom`,`ba1faccl`,`ba2faccl`,`ba3faccl`,`ti1faccl`,`ti2faccl`,`ti3faccl`,`tr1faccl`,`tr2faccl`,`tr3faccl`,`totfaccl`,`retfaccl`,`trefaccl`,`cuereten`,`nommacta`,`fecliqcl`,`SeContabiliza`,`correcto`) values (9,'V',1000031,'2007-10-15','43026488',2007,'EXP. 120700383',16.00,0.00,0.00,0.00,0.00,0.00,2,0,0,0,1037.67,0.00,0.00,166.03,0.00,0.00,0.00,0.00,0.00,1203.70,0.00,0.00,'','AUTOMATICA','2007-10-15','',0);

/*Table structure for table `wcabfactp` */

DROP TABLE IF EXISTS `wcabfactp`;

CREATE TABLE `wcabfactp` (
  `lugar` tinyint(4) NOT NULL DEFAULT '0',
  `codfaccl` int(11) NOT NULL DEFAULT '0',
  `numfaccl` varchar(10) NOT NULL DEFAULT '',
  `fecfaccl` date NOT NULL DEFAULT '0000-00-00',
  `codmacta` varchar(10) NOT NULL DEFAULT '',
  `anofaccl` smallint(6) NOT NULL DEFAULT '0',
  `confaccl` varchar(15) DEFAULT NULL,
  `pi1faccl` decimal(6,2) DEFAULT NULL,
  `pi2faccl` decimal(6,2) DEFAULT NULL,
  `pi3faccl` decimal(6,2) DEFAULT NULL,
  `pr1faccl` decimal(6,2) DEFAULT NULL,
  `pr2faccl` decimal(6,2) DEFAULT NULL,
  `pr3faccl` decimal(6,2) DEFAULT NULL,
  `retfaccl` decimal(6,2) DEFAULT NULL,
  `frefacpr` date DEFAULT NULL,
  `tp1faccl` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `tp2faccl` tinyint(3) unsigned DEFAULT NULL,
  `tp3faccl` tinyint(3) unsigned DEFAULT NULL,
  `idffaccl` tinyint(4) NOT NULL DEFAULT '0',
  `ba1faccl` decimal(12,2) NOT NULL DEFAULT '0.00',
  `ba2faccl` decimal(12,2) DEFAULT NULL,
  `ba3faccl` decimal(12,2) DEFAULT NULL,
  `ti1faccl` decimal(12,2) DEFAULT NULL,
  `ti2faccl` decimal(12,2) DEFAULT NULL,
  `ti3faccl` decimal(12,2) DEFAULT NULL,
  `tr1faccl` decimal(12,2) DEFAULT NULL,
  `tr2faccl` decimal(12,2) DEFAULT NULL,
  `tr3faccl` decimal(12,2) DEFAULT NULL,
  `totfaccl` decimal(14,2) DEFAULT NULL,
  `trefaccl` decimal(12,2) DEFAULT NULL,
  `cuereten` varchar(10) DEFAULT NULL,
  `nommacta` varchar(30) DEFAULT NULL,
  `fecliqcl` date DEFAULT NULL,
  `SeContabiliza` char(1) DEFAULT NULL,
  `correcto` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`lugar`,`codfaccl`,`anofaccl`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wcabfactp` */

/*Table structure for table `wcobro` */

DROP TABLE IF EXISTS `wcobro`;

CREATE TABLE `wcobro` (
  `lugar` tinyint(4) NOT NULL DEFAULT '0',
  `numserie` char(1) NOT NULL DEFAULT '',
  `codfaccl` int(11) NOT NULL DEFAULT '0',
  `fecfaccl` date NOT NULL DEFAULT '0000-00-00',
  `numorden` smallint(1) unsigned NOT NULL DEFAULT '0',
  `codmacta` varchar(10) NOT NULL DEFAULT '',
  `codforpa` smallint(6) NOT NULL DEFAULT '0',
  `fecvenci` date NOT NULL DEFAULT '0000-00-00',
  `impvenci` decimal(12,2) NOT NULL DEFAULT '0.00',
  `ctabanc1` varchar(10) NOT NULL DEFAULT '',
  `codbanco` smallint(1) unsigned DEFAULT '0',
  `codsucur` smallint(1) unsigned DEFAULT '0',
  `digcontr` char(2) DEFAULT NULL,
  `cuentaba` varchar(10) DEFAULT '0',
  `text33csb` varchar(40) DEFAULT NULL,
  `text41csb` varchar(40) DEFAULT NULL,
  `text42csb` varchar(40) DEFAULT NULL,
  `text43csb` varchar(40) DEFAULT NULL,
  `text51csb` varchar(40) DEFAULT NULL,
  `text52csb` varchar(40) DEFAULT NULL,
  `text53csb` varchar(40) DEFAULT NULL,
  `text61csb` varchar(40) DEFAULT NULL,
  `text62csb` varchar(40) DEFAULT NULL,
  `text63csb` varchar(40) DEFAULT NULL,
  `text71csb` varchar(40) DEFAULT NULL,
  `text72csb` varchar(40) DEFAULT NULL,
  `text73csb` varchar(40) DEFAULT NULL,
  `text81csb` varchar(40) DEFAULT NULL,
  `text82csb` varchar(40) DEFAULT NULL,
  `text83csb` varchar(40) DEFAULT NULL,
  `agente` smallint(5) unsigned DEFAULT NULL,
  `departamento` tinyint(4) DEFAULT NULL,
  `descforpa` varchar(40) DEFAULT NULL,
  `tipforpa` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lugar`,`numserie`,`codfaccl`,`fecfaccl`,`numorden`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wcobro` */

insert  into `wcobro`(`lugar`,`numserie`,`codfaccl`,`fecfaccl`,`numorden`,`codmacta`,`codforpa`,`fecvenci`,`impvenci`,`ctabanc1`,`codbanco`,`codsucur`,`digcontr`,`cuentaba`,`text33csb`,`text41csb`,`text42csb`,`text43csb`,`text51csb`,`text52csb`,`text53csb`,`text61csb`,`text62csb`,`text63csb`,`text71csb`,`text72csb`,`text73csb`,`text81csb`,`text82csb`,`text83csb`,`agente`,`departamento`,`descforpa`,`tipforpa`) values (9,'V',901589,'2007-09-30',1,'4300938',4,'2007-10-30',50.00,'7000302',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'CREDITO 30 D.',0);
insert  into `wcobro`(`lugar`,`numserie`,`codfaccl`,`fecfaccl`,`numorden`,`codmacta`,`codforpa`,`fecvenci`,`impvenci`,`ctabanc1`,`codbanco`,`codsucur`,`digcontr`,`cuentaba`,`text33csb`,`text41csb`,`text42csb`,`text43csb`,`text51csb`,`text52csb`,`text53csb`,`text61csb`,`text62csb`,`text63csb`,`text71csb`,`text72csb`,`text73csb`,`text81csb`,`text82csb`,`text83csb`,`agente`,`departamento`,`descforpa`,`tipforpa`) values (9,'V',901590,'2007-09-30',1,'4300938',4,'2007-10-30',50.00,'7000302',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,'CREDITO 30 D.',0);

/*Table structure for table `wconce340` */

DROP TABLE IF EXISTS `wconce340`;

CREATE TABLE `wconce340` (
  `codigo` varchar(3) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `wconce340` */

insert  into `wconce340`(`codigo`,`descripcion`) values ('0','OPERACION HABITUAL');
insert  into `wconce340`(`codigo`,`descripcion`) values ('A','A.- Asiento resumen de facturas.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('B','B.- Asiento resumen de tique.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('C','C.- Facturas con varios tipos impositivos.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('D','D.- Factura rectificativa.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('E','E.- IVA/IGIC devengado pendiente de emitir factura');
insert  into `wconce340`(`codigo`,`descripcion`) values ('F','F.- Adquisiciones realizadas por agencias de viajes.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('G','G.- R?gimen especial de grupo de entidades en IVA-IGIC.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('H','H.- R?gimen especial de oro de inversion.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('I','I.- Inversi?n del sujeto pasivo.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('J','J.- Tiques.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('K','K.- Rectificaci?n de errores registrales.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('L','L.- Adquisiciones a comerciantes minoristas del IGIC.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('M','M.- IVA/IGIC facturado pendiente de devengar (emitida factura).');
insert  into `wconce340`(`codigo`,`descripcion`) values ('N','N.- Facturacion de las prestaciones de servicios de agencias de viajes que actuan como mediadoras.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('O','O.- Factura emitida en sustituci?n de tiques facturados.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('P','P.- Adquisiciones intracomunitarias de bienes.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('Q','Q.- Operaciones a las que se aplique el R?gimen especial de bienes usados.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('R','R.- Operaci?n de arrendamiento de local de negocio.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('S','S.- Subvenciones, auxilios o ayudas satisfechas o recibidas.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('T','T.- Cobros por cuenta de terceros de honorarios profesionales.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('U','U.- Operaciones de seguros.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('V','V.- Compras de Agencias de Viajes.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('W','W.- Operaciones sujetas al impuesto sobre la Producci?n.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('X','X.- Operaciones por las que los empresarios que satisfagan compensaciones agricolas, ganaderas ? pesqueras hayan expedido recibo.');
insert  into `wconce340`(`codigo`,`descripcion`) values ('Z','Z.- R?gimen especial del criterio de caja.');

/*Table structure for table `wcontiposituinmo` */

DROP TABLE IF EXISTS `wcontiposituinmo`;

CREATE TABLE `wcontiposituinmo` (
  `situacio` tinyint(4) NOT NULL DEFAULT '0',
  `descsituacion` char(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`situacio`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wcontiposituinmo` */

insert  into `wcontiposituinmo`(`situacio`,`descsituacion`) values (1,'ACTIVO');
insert  into `wcontiposituinmo`(`situacio`,`descsituacion`) values (2,'VENDIDO');
insert  into `wcontiposituinmo`(`situacio`,`descsituacion`) values (3,'BAJA');
insert  into `wcontiposituinmo`(`situacio`,`descsituacion`) values (4,'AMORTIZADO');

/*Table structure for table `wdevolucion` */

DROP TABLE IF EXISTS `wdevolucion`;

CREATE TABLE `wdevolucion` (
  `codigo` varchar(10) NOT NULL,
  `descripcion` varchar(256) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `wdevolucion` */

insert  into `wdevolucion`(`codigo`,`descripcion`) values ('AC01','N?mero de cuenta incorrecto (IBAN no v?lido)');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('AC04','Cuenta cancelada');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('AC06','Cuenta bloqueada y/o cuenta bloqueada por el deudor para adeudos directos');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('AG01','Cuenta no admite Adeudos Directos');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('AG02','C?digo de operaci?n incorrecto');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('AM04','Saldo insuficiente');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('AM05','Operaci?n duplicada');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('BE01','Titular de la cuenta de cargo no coincide con el deudor');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('BE05','Identificador del acreedor incorrecto');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('FF01','Formato no v?lido');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('FF05','Tipo de adeudo incorrecto');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('MD01','Mandato no v?lido o inexistente');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('MD02','Faltan datos del mandato o son incorrectos');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('MD06','Operaci?n autorizada no conforme');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('MD07','Deudor fallecido');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('MS02','Raz?n no especificada por el cliente (orden del deudor)');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('MS03','Raz?n no especificada por la entidad del deudor');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('RC01','Identificador de la entidad incorrecto (BIC no v?lido)');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('RR01','Faltan identificaci?n o cuenta del deudor. Razones regulatorias');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('RR02','Falta nombre o direcci?n del deudor. Razones regulatorias');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('RR03','Falta nombre o direcci?n del acreedor. Razones regulatorias');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('RR04','Razones regulatorias');
insert  into `wdevolucion`(`codigo`,`descripcion`) values ('SL01','Servicios espec?ficos ofrecidos por la entidad del deudor');

/*Table structure for table `wlinfact` */

DROP TABLE IF EXISTS `wlinfact`;

CREATE TABLE `wlinfact` (
  `lugar` tinyint(4) NOT NULL DEFAULT '0',
  `numserie` char(1) NOT NULL DEFAULT '',
  `codfaccl` int(11) NOT NULL DEFAULT '0',
  `anofaccl` smallint(6) NOT NULL DEFAULT '0',
  `numlinea` smallint(6) NOT NULL DEFAULT '0',
  `codtbase` char(10) NOT NULL DEFAULT '',
  `impbascl` decimal(12,2) NOT NULL DEFAULT '0.00',
  `codccost` char(4) DEFAULT NULL,
  `correcto` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`lugar`,`numserie`,`codfaccl`,`anofaccl`,`numlinea`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wlinfact` */

insert  into `wlinfact`(`lugar`,`numserie`,`codfaccl`,`anofaccl`,`numlinea`,`codtbase`,`impbascl`,`codccost`,`correcto`) values (9,'V',1000031,2007,1,'70503003',1037.67,'VV01',0);

/*Table structure for table `wlinfactp` */

DROP TABLE IF EXISTS `wlinfactp`;

CREATE TABLE `wlinfactp` (
  `lugar` tinyint(4) NOT NULL DEFAULT '0',
  `codfaccl` int(11) NOT NULL DEFAULT '0',
  `anofaccl` smallint(6) NOT NULL DEFAULT '0',
  `numlinea` smallint(6) NOT NULL DEFAULT '0',
  `codtbase` char(10) NOT NULL DEFAULT '',
  `codccost` char(4) DEFAULT NULL,
  `impbascl` decimal(12,2) NOT NULL DEFAULT '0.00',
  `correcto` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`lugar`,`codfaccl`,`anofaccl`,`numlinea`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wlinfactp` */

insert  into `wlinfactp`(`lugar`,`codfaccl`,`anofaccl`,`numlinea`,`codtbase`,`codccost`,`impbascl`,`correcto`) values (1,1,1,32767,'',NULL,0.00,NULL);

/*Table structure for table `wnorma43` */

DROP TABLE IF EXISTS `wnorma43`;

CREATE TABLE `wnorma43` (
  `codusu` smallint(4) NOT NULL DEFAULT '0',
  `Orden` smallint(5) unsigned NOT NULL DEFAULT '0',
  `codmacta` char(10) NOT NULL DEFAULT '',
  `fecopera` date NOT NULL DEFAULT '0000-00-00',
  `fecvalor` date NOT NULL DEFAULT '0000-00-00',
  `importeD` decimal(12,2) DEFAULT NULL,
  `importeH` decimal(14,2) DEFAULT NULL,
  `concepto` char(30) DEFAULT NULL,
  `numdocum` char(10) NOT NULL DEFAULT '',
  `saldo` decimal(14,2) DEFAULT NULL,
  PRIMARY KEY (`codusu`,`Orden`,`codmacta`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wnorma43` */

insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,1,'572000015','2003-10-27','2003-10-27',81.10,NULL,'B58728585003 TECH DATA ESP','',15385.53);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,2,'572000015','2003-10-28','2003-10-28',115.07,NULL,'B58728585003 TECH DATA ESP','',15270.46);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,3,'572000015','2003-10-29','2003-10-29',1192.56,NULL,'Ariadna TRASPASO L.ABIERTA','',14077.90);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,4,'572000015','2003-10-29','2003-10-29',125.00,NULL,'Ariadna TRANSFERENCIA L.AB.','',13952.90);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,5,'572000015','2003-10-29','2003-10-29',908.46,NULL,'A28873040000 DIODE ESPA?A','',13044.44);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,6,'572000015','2003-10-29','2003-10-29',556.31,NULL,'A28873040000 DIODE ESPA?A','',12488.13);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,7,'572000015','2003-10-29','2003-10-29',245.92,NULL,'B96527403000 UNILIMP SERV.','',12242.21);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,8,'572000015','2003-10-30','2003-10-30',108.70,NULL,'R.INFOR-OFI, S.L.','',12133.51);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,9,'572000015','2003-10-30','2003-10-30',111.01,NULL,'COTITZ.SEG.SOC.','',12022.50);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,10,'572000015','2003-10-30','2003-10-30',3019.57,NULL,'COTITZ.SEG.SOC.','',9002.93);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,11,'572000015','2003-10-30','2003-10-30',471.34,NULL,'COTITZ.SEG.SOC.','',8531.59);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,12,'572000015','2003-10-30','2003-10-30',961.48,NULL,'Ariadna TRANSFERENCIA L.AB.','',7570.11);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,13,'572000015','2003-10-30','2003-10-30',1372.75,NULL,'Ariadna TRANSFERENCIA L.AB.','',6197.36);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,14,'572000015','2003-10-30','2003-10-30',1491.24,NULL,'Ariadna TRANSFERENCIA L.AB.','',4706.12);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,15,'572000015','2003-10-30','2003-10-30',345.38,NULL,'A95075578000 IBERDRO0219198100','',4360.74);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,16,'572000015','2003-10-30','2003-10-30',18.48,NULL,'B58728585003 TECH DATA ESP','',4342.26);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,17,'572000015','2003-10-30','2003-10-30',459.90,NULL,'A28873040000 DIODE ESPA?A','',3882.36);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,18,'572000015','2003-10-31','2003-10-31',NULL,222.72,'FACTIR17922287','',4105.08);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,19,'572000015','2003-10-31','2003-11-04',NULL,10748.73,'FACTIR17922287','',14853.81);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,20,'572000015','2003-10-31','2003-10-31',30.29,NULL,'COMFAC17922287','',14823.52);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,21,'572000015','2003-10-31','2003-10-31',1491.24,NULL,'Ariadna TRASPASO L.ABIERTA','',13332.28);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,22,'572000015','2003-10-31','2003-10-31',1491.24,NULL,'Ariadna TRASPASO L.ABIERTA','',11841.04);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,23,'572000015','2003-10-31','2003-10-31',966.04,NULL,'Ariadna TRANSFERENCIA L.AB.','',10875.00);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,24,'572000015','2003-10-31','2003-10-31',1412.95,NULL,'Ariadna TRANSFERENCIA L.AB.','',9462.05);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,25,'572000015','2003-10-31','2003-10-31',1473.10,NULL,'Ariadna TRANSFERENCIA L.AB.','',7988.95);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,26,'572000015','2003-10-31','2003-10-31',8.36,NULL,'SERVICIO LINEA AB.','',7980.59);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,27,'572000015','2003-11-01','2003-11-01',2.23,NULL,'INTERES.DESCUBIERTO','',7978.36);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,28,'572000015','2003-11-01','2003-11-01',14.90,NULL,'T. VISA ORO','',7963.46);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,29,'572000015','2003-11-01','2003-10-31',1395.84,NULL,'Q2827003A001 S.S. REG.GRAL.','',6567.62);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,30,'572000015','2003-11-01','2003-10-31',19.87,NULL,'A46255949001 CORGAR 98','',6547.75);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,31,'572000015','2003-11-01','2003-10-31',25.13,NULL,'A46255949000 CORGAR 98','',6522.62);
insert  into `wnorma43`(`codusu`,`Orden`,`codmacta`,`fecopera`,`fecvalor`,`importeD`,`importeH`,`concepto`,`numdocum`,`saldo`) values (22000,32,'572000015','2003-11-01','2003-10-31',43.36,NULL,'A46255949000 CORGAR 98','',6479.26);

/*Table structure for table `wpagop` */

DROP TABLE IF EXISTS `wpagop`;

CREATE TABLE `wpagop` (
  `lugar` tinyint(4) NOT NULL DEFAULT '0',
  `ctaprove` varchar(10) NOT NULL DEFAULT '',
  `numfactu` varchar(10) NOT NULL DEFAULT '',
  `fecfactu` date NOT NULL DEFAULT '0000-00-00',
  `numorden` smallint(1) unsigned NOT NULL DEFAULT '0',
  `codforpa` smallint(6) NOT NULL DEFAULT '0',
  `fecefect` date NOT NULL DEFAULT '0000-00-00',
  `impefect` decimal(12,2) NOT NULL DEFAULT '0.00',
  `fecultpa` date DEFAULT NULL,
  `imppagad` decimal(12,2) DEFAULT NULL,
  `ctabanc1` varchar(10) NOT NULL DEFAULT '',
  `ctabanc2` varchar(10) DEFAULT NULL,
  `emitdocum` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `contdocu` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `text1csb` varchar(36) DEFAULT NULL,
  `text2csb` varchar(36) DEFAULT NULL,
  `descforpa` varchar(40) DEFAULT NULL,
  `tipforpa` tinyint(4) NOT NULL DEFAULT '0',
  `entidad` varchar(4) DEFAULT NULL,
  `oficina` varchar(4) DEFAULT NULL,
  `CC` char(2) DEFAULT NULL,
  `cuentaba` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`lugar`,`ctaprove`,`numfactu`,`fecfactu`,`numorden`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wpagop` */

insert  into `wpagop`(`lugar`,`ctaprove`,`numfactu`,`fecfactu`,`numorden`,`codforpa`,`fecefect`,`impefect`,`fecultpa`,`imppagad`,`ctabanc1`,`ctabanc2`,`emitdocum`,`contdocu`,`text1csb`,`text2csb`,`descforpa`,`tipforpa`,`entidad`,`oficina`,`CC`,`cuentaba`) values (2,'4300001','Nf:/12','2005-02-01',1,99,'2005-12-31',2005.06,NULL,NULL,'5720002',NULL,0,0,'csb1',NULL,'Mi forpa',1,'2077','2','3','4145691');
insert  into `wpagop`(`lugar`,`ctaprove`,`numfactu`,`fecfactu`,`numorden`,`codforpa`,`fecefect`,`impefect`,`fecultpa`,`imppagad`,`ctabanc1`,`ctabanc2`,`emitdocum`,`contdocu`,`text1csb`,`text2csb`,`descforpa`,`tipforpa`,`entidad`,`oficina`,`CC`,`cuentaba`) values (22,'4400000004','40006','2012-05-07',1,100,'2012-05-07',1.38,NULL,NULL,'5720000001',NULL,0,0,'Devolucion Aportacion F.O.','CANET BOIGUES, JUAN','Transferencia',1,'3188','46','11','1346921214');
insert  into `wpagop`(`lugar`,`ctaprove`,`numfactu`,`fecfactu`,`numorden`,`codforpa`,`fecefect`,`impefect`,`fecultpa`,`imppagad`,`ctabanc1`,`ctabanc2`,`emitdocum`,`contdocu`,`text1csb`,`text2csb`,`descforpa`,`tipforpa`,`entidad`,`oficina`,`CC`,`cuentaba`) values (22,'4400000004','40024','2012-05-07',1,100,'2012-05-07',3.14,NULL,NULL,'5720000001',NULL,0,0,'Devolucion Aportacion F.O.','ANDRES LLACER, JOSE','Transferencia',1,'3188','46','19','1346923616');
insert  into `wpagop`(`lugar`,`ctaprove`,`numfactu`,`fecfactu`,`numorden`,`codforpa`,`fecefect`,`impefect`,`fecultpa`,`imppagad`,`ctabanc1`,`ctabanc2`,`emitdocum`,`contdocu`,`text1csb`,`text2csb`,`descforpa`,`tipforpa`,`entidad`,`oficina`,`CC`,`cuentaba`) values (22,'4400000004','40025','2012-05-07',1,100,'2012-05-07',0.70,NULL,NULL,'5720000001',NULL,0,0,'Devolucion Aportacion F.O.','BRINES ALEIXANDRE, ELODIA','Transferencia',1,'3188','46','18','1346923715');
insert  into `wpagop`(`lugar`,`ctaprove`,`numfactu`,`fecfactu`,`numorden`,`codforpa`,`fecefect`,`impefect`,`fecultpa`,`imppagad`,`ctabanc1`,`ctabanc2`,`emitdocum`,`contdocu`,`text1csb`,`text2csb`,`descforpa`,`tipforpa`,`entidad`,`oficina`,`CC`,`cuentaba`) values (22,'4400000004','40033','2012-05-07',1,100,'2012-05-07',27.10,NULL,NULL,'5720000001',NULL,0,0,'Devolucion Aportacion F.O.','BENAVENT RIPOLL, J. VICENTE','Transferencia',1,'3188','46','19','1346925710');
insert  into `wpagop`(`lugar`,`ctaprove`,`numfactu`,`fecfactu`,`numorden`,`codforpa`,`fecefect`,`impefect`,`fecultpa`,`imppagad`,`ctabanc1`,`ctabanc2`,`emitdocum`,`contdocu`,`text1csb`,`text2csb`,`descforpa`,`tipforpa`,`entidad`,`oficina`,`CC`,`cuentaba`) values (22,'4400000004','40052','2012-05-07',1,100,'2012-05-07',8.37,NULL,NULL,'5720000001',NULL,0,0,'Devolucion Aportacion F.O.','BRINES BLASCO, JOAN','Transferencia',1,'3188','46','14','1346929811');
insert  into `wpagop`(`lugar`,`ctaprove`,`numfactu`,`fecfactu`,`numorden`,`codforpa`,`fecefect`,`impefect`,`fecultpa`,`imppagad`,`ctabanc1`,`ctabanc2`,`emitdocum`,`contdocu`,`text1csb`,`text2csb`,`descforpa`,`tipforpa`,`entidad`,`oficina`,`CC`,`cuentaba`) values (22,'4400000004','40056','2012-05-07',1,100,'2012-05-07',3.65,NULL,NULL,'5720000001',NULL,0,0,'Devolucion Aportacion F.O.','BRINES SERRANO, FRANCISCO','Transferencia',1,'3188','46','12','1346930512');

/*Table structure for table `wtipoamortizacion` */

DROP TABLE IF EXISTS `wtipoamortizacion`;

CREATE TABLE `wtipoamortizacion` (
  `tipoamor` tinyint(4) NOT NULL DEFAULT '0',
  `desctipoamor` char(10) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `wtipoamortizacion` */

insert  into `wtipoamortizacion`(`tipoamor`,`desctipoamor`) values (1,'ANUAL');
insert  into `wtipoamortizacion`(`tipoamor`,`desctipoamor`) values (2,'SEMESTRAL');
insert  into `wtipoamortizacion`(`tipoamor`,`desctipoamor`) values (3,'TRIMESTRAL');
insert  into `wtipoamortizacion`(`tipoamor`,`desctipoamor`) values (4,'MENSUAL');

/*Table structure for table `wtipoconceptos` */

DROP TABLE IF EXISTS `wtipoconceptos`;

CREATE TABLE `wtipoconceptos` (
  `tipoconce` tinyint(1) NOT NULL DEFAULT '0',
  `desctipo` char(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `wtipoconceptos` */

insert  into `wtipoconceptos`(`tipoconce`,`desctipo`) values (1,'Debe');
insert  into `wtipoconceptos`(`tipoconce`,`desctipo`) values (2,'Haber');
insert  into `wtipoconceptos`(`tipoconce`,`desctipo`) values (3,'Decide en asiento');

/*Table structure for table `wtipointra` */

DROP TABLE IF EXISTS `wtipointra`;

CREATE TABLE `wtipointra` (
  `codintra` varchar(1) NOT NULL,
  `nomintra` varchar(256) NOT NULL,
  PRIMARY KEY (`codintra`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `wtipointra` */

insert  into `wtipointra`(`codintra`,`nomintra`) values ('A','A.- Adquisiciones intracomunitarias sujetas.');
insert  into `wtipointra`(`codintra`,`nomintra`) values ('E','E.- Entregas intracomunitarias exentas.');
insert  into `wtipointra`(`codintra`,`nomintra`) values ('H','H.- Entregas intracomunitarias de bienes posteriores a una importaci?n exenta, efectuadas por el representante fiscal.');
insert  into `wtipointra`(`codintra`,`nomintra`) values ('I','I.- Adquisiciones intracomunitarias de servicios');
insert  into `wtipointra`(`codintra`,`nomintra`) values ('M','M.- Entregas intracomunitarias de bienes posteriores a una importaci?n exenta.');
insert  into `wtipointra`(`codintra`,`nomintra`) values ('S','S.- Prestaciones intracomunitarias de servicios.');
insert  into `wtipointra`(`codintra`,`nomintra`) values ('T','T.- Entregas en otros Estados miembros subsiguientes a adquisiciones intracomunitarias.');

/*Table structure for table `wtipopera` */

DROP TABLE IF EXISTS `wtipopera`;

CREATE TABLE `wtipopera` (
  `codigo` smallint(2) unsigned NOT NULL,
  `denominacion` varchar(50) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `wtipopera` */

insert  into `wtipopera`(`codigo`,`denominacion`) values (0,'GENERAL');
insert  into `wtipopera`(`codigo`,`denominacion`) values (1,'INTRACOMUNITARIA');
insert  into `wtipopera`(`codigo`,`denominacion`) values (2,'EXPORT. - IMPORT.');
insert  into `wtipopera`(`codigo`,`denominacion`) values (3,'INTERIOR EXENTA');
insert  into `wtipopera`(`codigo`,`denominacion`) values (4,'INV. SUJETO PASIVO');
insert  into `wtipopera`(`codigo`,`denominacion`) values (5,'R.E.A.');

/*Table structure for table `wtiporemesa` */

DROP TABLE IF EXISTS `wtiporemesa`;

CREATE TABLE `wtiporemesa` (
  `tipo` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `Descripcion` varchar(30) NOT NULL DEFAULT '0',
  PRIMARY KEY (`tipo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wtiporemesa` */

insert  into `wtiporemesa`(`tipo`,`Descripcion`) values (0,'NORMA 19');
insert  into `wtiporemesa`(`tipo`,`Descripcion`) values (1,'NORMA 32');
insert  into `wtiporemesa`(`tipo`,`Descripcion`) values (2,'NORMA 58');
insert  into `wtiporemesa`(`tipo`,`Descripcion`) values (3,'SEPA XML');

/*Table structure for table `wtiporemesa2` */

DROP TABLE IF EXISTS `wtiporemesa2`;

CREATE TABLE `wtiporemesa2` (
  `tipo` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `DescripcionT` varchar(30) NOT NULL DEFAULT '0',
  PRIMARY KEY (`tipo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wtiporemesa2` */

insert  into `wtiporemesa2`(`tipo`,`DescripcionT`) values (1,'EFECTOS');
insert  into `wtiporemesa2`(`tipo`,`DescripcionT`) values (2,'PAGAR?S');
insert  into `wtiporemesa2`(`tipo`,`DescripcionT`) values (3,'TALONES');
insert  into `wtiporemesa2`(`tipo`,`DescripcionT`) values (4,'ABONOS');

/*Table structure for table `wtiporeten` */

DROP TABLE IF EXISTS `wtiporeten`;

CREATE TABLE `wtiporeten` (
  `codigo` smallint(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `tipo` tinyint(4) NOT NULL COMMENT '0=B.Imp. 1=Total',
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `wtiporeten` */

insert  into `wtiporeten`(`codigo`,`descripcion`,`tipo`) values (0,'SIN RETENCION',0);
insert  into `wtiporeten`(`codigo`,`descripcion`,`tipo`) values (1,'ACTIVIDAD PROFESIONAL',0);
insert  into `wtiporeten`(`codigo`,`descripcion`,`tipo`) values (2,'ACTIVIDAD AGRICOLA',1);
insert  into `wtiporeten`(`codigo`,`descripcion`,`tipo`) values (3,'ARRENDAMIENTO',0);
insert  into `wtiporeten`(`codigo`,`descripcion`,`tipo`) values (4,'ACTIVIDAD EMPRESARIAL',0);
insert  into `wtiporeten`(`codigo`,`descripcion`,`tipo`) values (5,'PREMIOS POR PARTICIPACION EN JUEGOS',0);
insert  into `wtiporeten`(`codigo`,`descripcion`,`tipo`) values (6,'GANACIAS PATRIMONIALES DE APROV. FORESTALES',0);
insert  into `wtiporeten`(`codigo`,`descripcion`,`tipo`) values (7,'CONTRAPRESTACION POR LA CESION DE DERECHOS DE IMAGEN',0);

/*Table structure for table `wtiposituacionrem` */

DROP TABLE IF EXISTS `wtiposituacionrem`;

CREATE TABLE `wtiposituacionrem` (
  `situacio` char(1) NOT NULL DEFAULT '',
  `descsituacion` varchar(255) NOT NULL,
  PRIMARY KEY (`situacio`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `wtiposituacionrem` */

insert  into `wtiposituacionrem`(`situacio`,`descsituacion`) values ('A','ABIERTA');
insert  into `wtiposituacionrem`(`situacio`,`descsituacion`) values ('B','GENERADO SOPORTE');
insert  into `wtiposituacionrem`(`situacio`,`descsituacion`) values ('F','CANCELACION CLIENTE');
insert  into `wtiposituacionrem`(`situacio`,`descsituacion`) values ('H','CONFIRMACION REMESA');
insert  into `wtiposituacionrem`(`situacio`,`descsituacion`) values ('Q','ABONADA');
insert  into `wtiposituacionrem`(`situacio`,`descsituacion`) values ('Y','EFECTOS PARCIALMENTE ELIMINADOS');
insert  into `wtiposituacionrem`(`situacio`,`descsituacion`) values ('Z','EFECTOS ELIMINADOS');

/*Table structure for table `ztesoreriacomun` */

DROP TABLE IF EXISTS `ztesoreriacomun`;

CREATE TABLE `ztesoreriacomun` (
  `codusu` mediumint(1) unsigned NOT NULL DEFAULT '0',
  `codigo` int(1) unsigned NOT NULL DEFAULT '0',
  `texto1` varchar(35) DEFAULT NULL,
  `texto2` varchar(35) DEFAULT NULL,
  `texto3` varchar(35) DEFAULT NULL,
  `texto4` varchar(35) DEFAULT NULL,
  `texto5` varchar(35) DEFAULT NULL,
  `texto6` varchar(35) DEFAULT NULL,
  `importe1` decimal(14,2) DEFAULT NULL,
  `importe2` decimal(14,2) DEFAULT NULL,
  `fecha1` date DEFAULT NULL,
  `fecha2` date DEFAULT NULL,
  `fecha3` date DEFAULT NULL,
  `observa1` varchar(255) DEFAULT NULL,
  `observa2` varchar(255) DEFAULT NULL,
  `opcion` tinyint(4) DEFAULT '0',
  `Texto` text,
  PRIMARY KEY (`codusu`,`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `ztesoreriacomun` */

/*Table structure for table `ztmpfaclin` */

DROP TABLE IF EXISTS `ztmpfaclin`;

CREATE TABLE `ztmpfaclin` (
  `asdasdasda` bit(1) DEFAULT NULL,
  `codusu` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `ztmpfaclin` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
