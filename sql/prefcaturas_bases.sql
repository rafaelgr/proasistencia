/*
SQLyog Community v12.3.3 (64 bit)
MySQL - 5.7.14-log : Database - proasistencia
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`proasistencia` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `proasistencia`;

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
) ENGINE=InnoDB AUTO_INCREMENT=283 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
