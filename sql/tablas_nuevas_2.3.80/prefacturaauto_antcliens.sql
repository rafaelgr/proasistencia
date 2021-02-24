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

/*Table structure for table `prefacturaauto_antcliens` */

DROP TABLE IF EXISTS `prefacturaauto_antcliens`;

CREATE TABLE `prefacturaauto_antcliens` (
  `prefacturaAntclienId` int(11) NOT NULL auto_increment,
  `prefacturaAutoId` int(11) default NULL,
  `antClienId` int(11) default NULL,
  PRIMARY KEY  (`prefacturaAntclienId`),
  KEY `facAnt_facprove2` (`prefacturaAutoId`),
  KEY `facAnt_antprove2` (`antClienId`),
  CONSTRAINT `facAnt_facprove2` FOREIGN KEY (`prefacturaAutoId`) REFERENCES `prefacturasauto` (`prefacturaAutoId`),
  CONSTRAINT `facAnt_antprove2` FOREIGN KEY (`antClienId`) REFERENCES `antclien` (`antClienId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
