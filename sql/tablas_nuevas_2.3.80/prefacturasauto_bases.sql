/*
SQLyog Community
MySQL - 5.0.27-community-nt : Database - proasistencia
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`proasistencia` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `proasistencia`;

/*Table structure for table `prefacturasauto_bases` */

DROP TABLE IF EXISTS `prefacturasauto_bases`;

CREATE TABLE `prefacturasauto_bases` (
  `prefacturaAutoBaseId` int(11) NOT NULL auto_increment,
  `prefacturaAutoId` int(11) default NULL,
  `tipoIvaId` int(11) default NULL,
  `porcentaje` decimal(5,2) default NULL,
  `base` decimal(12,2) default NULL,
  `cuota` decimal(12,2) default NULL,
  PRIMARY KEY  (`prefacturaAutoBaseId`),
  UNIQUE KEY `factb_prefac_iva2` (`prefacturaAutoId`,`tipoIvaId`),
  KEY `factb_tipos_iva2` (`tipoIvaId`),
  CONSTRAINT `factb_facturas2` FOREIGN KEY (`prefacturaAutoId`) REFERENCES `prefacturasauto` (`prefacturaAutoId`) ON DELETE CASCADE,
  CONSTRAINT `factb_tipos_iva2` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
