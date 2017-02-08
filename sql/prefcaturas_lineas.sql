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

/*Table structure for table `prefacturas_lineas` */

DROP TABLE IF EXISTS `prefacturas_lineas`;

CREATE TABLE `prefacturas_lineas` (
  `prefacturaLineaId` int(11) NOT NULL AUTO_INCREMENT,
  `linea` decimal(6,3) DEFAULT NULL,
  `prefacturaId` int(11) DEFAULT NULL,
  `unidadId` int(11) DEFAULT NULL,
  `articuloId` int(11) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `descripcion` text,
  `cantidad` decimal(6,2) DEFAULT NULL,
  `importe` decimal(10,2) DEFAULT NULL,
  `totalLinea` decimal(12,2) DEFAULT NULL,
  `coste` decimal(12,2) DEFAULT NULL,
  `porcentajeBeneficio` decimal(5,2) DEFAULT NULL,
  `porcentajeAgente` decimal(5,2) DEFAULT NULL,
  `capituloLinea` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`prefacturaLineaId`),
  KEY `prefl_prefacturas` (`prefacturaId`),
  KEY `prefl_articulos` (`articuloId`),
  KEY `prefl_tipos_iva` (`tipoIvaId`),
  KEY `prefl_unidades` (`unidadId`),
  CONSTRAINT `prefl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `prefl_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `prefacturas` (`prefacturaId`) ON DELETE CASCADE,
  CONSTRAINT `prefl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`),
  CONSTRAINT `prefl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=236 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
