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

/*Table structure for table `prefacturasauto_lineas` */

DROP TABLE IF EXISTS `prefacturasauto_lineas`;

CREATE TABLE `prefacturasauto_lineas` (
  `prefacturaAutoLineaId` int(11) NOT NULL auto_increment,
  `linea` decimal(6,3) default NULL,
  `prefacturaAutoId` int(11) default NULL,
  `unidadId` int(11) default NULL,
  `articuloId` int(11) default NULL,
  `tipoIvaId` int(11) default NULL,
  `porcentaje` decimal(5,2) default NULL,
  `descripcion` text,
  `cantidad` decimal(6,2) default NULL,
  `importe` decimal(14,4) default NULL,
  `totalLinea` decimal(12,2) default NULL,
  `coste` decimal(14,4) default NULL,
  `porcentajeBeneficio` decimal(7,4) default NULL,
  `porcentajeAgente` decimal(5,2) default NULL,
  `capituloLinea` varchar(255) default NULL,
  PRIMARY KEY  (`prefacturaAutoLineaId`),
  KEY `factl_facturas2` (`prefacturaAutoId`),
  KEY `factl_articulos2` (`articuloId`),
  KEY `factl_tipos_iva2` (`tipoIvaId`),
  KEY `factl_unidades2` (`unidadId`),
  CONSTRAINT `factl_facturas2` FOREIGN KEY (`prefacturaAutoId`) REFERENCES `prefacturasauto` (`prefacturaAutoId`) ON DELETE CASCADE,
  CONSTRAINT `factl_articulos2` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `factl_tipos_iva2` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`),
  CONSTRAINT `factl_unidades2` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
