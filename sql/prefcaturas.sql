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

/*Table structure for table `prefacturas` */

DROP TABLE IF EXISTS `prefacturas`;

CREATE TABLE `prefacturas` (
  `prefacturaId` int(11) NOT NULL AUTO_INCREMENT,
  `ano` int(11) DEFAULT NULL,
  `numero` int(11) DEFAULT NULL,
  `serie` varchar(255) DEFAULT NULL,
  `tipoProyectoId` int(11) DEFAULT NULL,
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
  `sel` tinyint(1) DEFAULT '0',
  `facturaId` int(11) DEFAULT NULL,
  `totalAlCliente` decimal(12,2) DEFAULT NULL,
  `coste` decimal(12,2) DEFAULT NULL,
  `generada` tinyint(1) DEFAULT '1',
  `porcentajeBeneficio` decimal(5,2) DEFAULT NULL,
  `porcentajeAgente` decimal(5,2) DEFAULT NULL,
  `contratoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`prefacturaId`),
  KEY `pref_empresas` (`empresaId`),
  KEY `pref_clientes` (`clienteId`),
  KEY `pref_formas_pago` (`formaPagoId`),
  KEY `pref_contratos` (`contratoClienteMantenimientoId`),
  KEY `pref_facturas` (`facturaId`),
  KEY `pf_tipoProyecto` (`tipoProyectoId`),
  KEY `pref_contrato` (`contratoId`),
  CONSTRAINT `pf_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto` (`tipoProyectoId`),
  CONSTRAINT `pref_clientes` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `pref_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`),
  CONSTRAINT `pref_contratos` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `pref_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `pref_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`),
  CONSTRAINT `pref_formas_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`)
) ENGINE=InnoDB AUTO_INCREMENT=233 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
