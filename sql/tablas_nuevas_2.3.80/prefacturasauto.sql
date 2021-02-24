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

/*Table structure for table `prefacturasauto` */

DROP TABLE IF EXISTS `prefacturasauto`;

CREATE TABLE `prefacturasauto` (
  `prefacturaAutoId` int(11) NOT NULL auto_increment,
  `ano` int(11) default NULL,
  `numero` int(11) default NULL,
  `serie` varchar(255) default NULL,
  `tipoProyectoId` int(11) default NULL,
  `fecha` date default NULL,
  `empresaId` int(11) default NULL,
  `clienteId` int(11) default NULL,
  `contratoClienteMantenimientoId` int(11) default NULL,
  `emisorNif` varchar(255) default NULL,
  `emisorNombre` varchar(255) default NULL,
  `emisorDireccion` varchar(255) default NULL,
  `emisorCodPostal` varchar(255) default NULL,
  `emisorPoblacion` varchar(255) default NULL,
  `emisorProvincia` varchar(255) default NULL,
  `receptorNif` varchar(255) default NULL,
  `receptorNombre` varchar(255) default NULL,
  `receptorDireccion` varchar(255) default NULL,
  `receptorCodPostal` varchar(255) default NULL,
  `receptorPoblacion` varchar(255) default NULL,
  `receptorProvincia` varchar(255) default NULL,
  `total` decimal(12,2) default NULL,
  `totalConIva` decimal(12,2) default NULL,
  `formaPagoId` int(11) default NULL,
  `observaciones` text,
  `sel` tinyint(1) default '0',
  `totalAlCliente` decimal(12,2) default NULL,
  `coste` decimal(14,4) default NULL,
  `generada` tinyint(1) default '1',
  `porcentajeBeneficio` decimal(9,6) default NULL,
  `porcentajeAgente` decimal(5,2) default NULL,
  `contratoId` int(11) default NULL,
  `periodo` varchar(255) default NULL,
  `obsFactura` text,
  `porcentajeRetencion` decimal(4,2) default NULL,
  `importeRetencion` decimal(12,2) default NULL,
  `mantenedorDesactivado` tinyint(1) default '0',
  `contafich` varchar(255) default NULL COMMENT 'Nombre del fichero de exportación a contabilidad',
  `enviadaCorreo` tinyint(1) default '0',
  `ficheroCorreo` varchar(255) default NULL,
  `devuelta` tinyint(1) default '0',
  `facturada` tinyint(1) default '0',
  `departamentoId` int(11) default NULL,
  `conceptoAnticipo` varchar(255) default NULL,
  `noCalculadora` tinyint(1) default '0',
  `importeAnticipo` decimal(12,2) default '0.00',
  `restoCobrar` decimal(12,2) default '0.00',
  `observacionesPago` text,
  `noContabilizar` tinyint(1) default '0',
  `facturaId` int(11) default NULL,
  PRIMARY KEY  (`prefacturaAutoId`),
  KEY `prefacAuto_empresas` (`empresaId`),
  KEY `prefacAuto_clientes` (`clienteId`),
  KEY `prefacAuto_formas_pago` (`formaPagoId`),
  KEY `prefacAuto_contratos` (`contratoClienteMantenimientoId`),
  KEY `prefacAuto_tipoProyecto` (`tipoProyectoId`),
  KEY `prefacAuto_contrato` (`contratoId`),
  KEY `prefacAuto_departamento` (`departamentoId`),
  KEY `prefacAuto_facturas` (`facturaId`),
  CONSTRAINT `prefacAuto_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`) ON DELETE SET NULL,
  CONSTRAINT `prefacAuto_clientes` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `prefacAuto_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`),
  CONSTRAINT `prefacAuto_contratos` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `prefacAuto_departamento` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos` (`departamentoId`),
  CONSTRAINT `prefacAuto_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `prefacAuto_formas_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `prefacAuto_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto` (`tipoProyectoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
