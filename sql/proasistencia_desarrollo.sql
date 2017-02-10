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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

/*Table structure for table `carga_agrupaciones` */

DROP TABLE IF EXISTS `carga_agrupaciones`;

CREATE TABLE `carga_agrupaciones` (
  `codigo` varchar(4) DEFAULT NULL,
  `descripcion` varchar(40) DEFAULT NULL,
  `notas` mediumtext,
  `fecha_m` datetime DEFAULT NULL,
  `usu_m` varchar(8) DEFAULT NULL,
  `fecha_e` datetime DEFAULT NULL,
  `usu_e` varchar(8) DEFAULT NULL,
  `fecha_i` datetime DEFAULT NULL,
  `usu_i` varchar(8) DEFAULT NULL,
  `tipo_rappel` varchar(5) DEFAULT NULL,
  `incluir_servicios` varchar(1) DEFAULT NULL,
  `fecha_alta` datetime DEFAULT NULL,
  `nombre` varchar(60) DEFAULT NULL,
  `nombre_comercial` varchar(60) DEFAULT NULL,
  `domicilio` varchar(60) DEFAULT NULL,
  `domicilio2` varchar(60) DEFAULT NULL,
  `poblacion` varchar(60) DEFAULT NULL,
  `distrito` varchar(5) DEFAULT NULL,
  `provincia` varchar(30) DEFAULT NULL,
  `telefono` varchar(60) DEFAULT NULL,
  `fax` varchar(60) DEFAULT NULL,
  `mail` mediumtext,
  `contacto` varchar(60) DEFAULT NULL,
  `fecha_baja` datetime DEFAULT NULL,
  `tarifa` varchar(5) DEFAULT NULL,
  `usuario_web` varchar(50) DEFAULT NULL,
  `password_web` varchar(20) DEFAULT NULL,
  `activo_web` varchar(1) DEFAULT NULL,
  `password_confirmar_web` varchar(20) DEFAULT NULL,
  `ntarifa` int(11) DEFAULT NULL,
  `ultima_empresa` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `carga_centrales` */

DROP TABLE IF EXISTS `carga_centrales`;

CREATE TABLE `carga_centrales` (
  `codigo` decimal(10,0) DEFAULT NULL,
  `nombre` varchar(40) DEFAULT NULL,
  `nif` varchar(15) DEFAULT NULL,
  `activo` varchar(1) DEFAULT NULL,
  `fecha_alta` datetime DEFAULT NULL,
  `fecha_baja` datetime DEFAULT NULL,
  `contacto_1` varchar(40) DEFAULT NULL,
  `contacto_2` varchar(40) DEFAULT NULL,
  `direccion` varchar(40) DEFAULT NULL,
  `poblacion` varchar(40) DEFAULT NULL,
  `provincia` varchar(20) DEFAULT NULL,
  `distrito` varchar(5) DEFAULT NULL,
  `telefono1` varchar(20) DEFAULT NULL,
  `telefono2` varchar(20) DEFAULT NULL,
  `fax` varchar(20) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `tarifa_servicios` varchar(5) DEFAULT NULL,
  `forma_pago` varchar(4) DEFAULT NULL,
  `dia1_pago` smallint(6) DEFAULT NULL,
  `dia2_pago` smallint(6) DEFAULT NULL,
  `dia3_pago` smallint(6) DEFAULT NULL,
  `dia4_pago` smallint(6) DEFAULT NULL,
  `mes_sefectos` smallint(6) DEFAULT NULL,
  `limite_credito` decimal(15,0) DEFAULT NULL,
  `limite_credito_eu` decimal(15,2) DEFAULT NULL,
  `notas` mediumtext,
  `comercial` int(11) DEFAULT NULL,
  `codigo_agrupacion` varchar(4) DEFAULT NULL,
  `motivo_baja` varchar(2) DEFAULT NULL,
  `banco` varchar(40) DEFAULT NULL,
  `direccion_banco` varchar(40) DEFAULT NULL,
  `poblacion_banco` varchar(40) DEFAULT NULL,
  `provincia_banco` varchar(20) DEFAULT NULL,
  `distrito_banco` varchar(5) DEFAULT NULL,
  `cuenta_corriente` varchar(20) DEFAULT NULL,
  `informe_financiero` varchar(20) DEFAULT NULL,
  `factura_por_centro` varchar(1) DEFAULT NULL,
  `factura_por_siniestro` varchar(1) DEFAULT NULL,
  `condiciones_globales` varchar(1) DEFAULT NULL,
  `girar_banco_central` varchar(1) DEFAULT NULL,
  `recargo` varchar(1) DEFAULT NULL,
  `descuento` decimal(5,2) DEFAULT NULL,
  `fecha_m` datetime DEFAULT NULL,
  `usu_m` varchar(8) DEFAULT NULL,
  `tarifa` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `carga_comerciales` */

DROP TABLE IF EXISTS `carga_comerciales`;

CREATE TABLE `carga_comerciales` (
  `codigo` int(11) DEFAULT NULL,
  `empresa` varchar(40) DEFAULT NULL,
  `nif` varchar(15) DEFAULT NULL,
  `activo` varchar(1) DEFAULT NULL,
  `fecha_alta` datetime DEFAULT NULL,
  `fecha_baja` datetime DEFAULT NULL,
  `contacto_1` varchar(40) DEFAULT NULL,
  `contacto_2` varchar(40) DEFAULT NULL,
  `direccion` varchar(40) DEFAULT NULL,
  `poblacion` varchar(40) DEFAULT NULL,
  `provincia` varchar(20) DEFAULT NULL,
  `distrito` varchar(5) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fax` varchar(20) DEFAULT NULL,
  `e_mail` varchar(40) DEFAULT NULL,
  `usu_m` varchar(8) DEFAULT NULL,
  `fecha_m` datetime DEFAULT NULL,
  `fijo` decimal(9,2) DEFAULT NULL,
  `comision1` decimal(5,2) DEFAULT NULL,
  `hasta_cantidad1` decimal(14,2) DEFAULT NULL,
  `comision2` decimal(5,2) DEFAULT NULL,
  `hasta_cantidad2` decimal(14,2) DEFAULT NULL,
  `comision3` decimal(5,2) DEFAULT NULL,
  `hasta_cantidad3` decimal(14,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `carga_locales` */

DROP TABLE IF EXISTS `carga_locales`;

CREATE TABLE `carga_locales` (
  `codigo` varchar(9) DEFAULT NULL,
  `nombre` varchar(60) DEFAULT NULL,
  `nif` varchar(15) DEFAULT NULL,
  `tipo_cliente` smallint(6) DEFAULT NULL,
  `tipo_cliente_iva` smallint(6) DEFAULT NULL,
  `activo` varchar(1) DEFAULT NULL,
  `fecha_alta` datetime DEFAULT NULL,
  `fecha_baja` datetime DEFAULT NULL,
  `tarifa_servicios` varchar(5) DEFAULT NULL,
  `tarifa` smallint(6) DEFAULT NULL,
  `contacto_1` varchar(40) DEFAULT NULL,
  `contacto_2` varchar(40) DEFAULT NULL,
  `direccion` varchar(60) DEFAULT NULL,
  `poblacion` varchar(40) DEFAULT NULL,
  `provincia` varchar(20) DEFAULT NULL,
  `distrito` varchar(5) DEFAULT NULL,
  `telefono_1` varchar(20) DEFAULT NULL,
  `telefono_2` varchar(20) DEFAULT NULL,
  `fax` varchar(20) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `forma_pago` varchar(4) DEFAULT NULL,
  `notas` mediumtext,
  `motivo_baja` varchar(2) DEFAULT NULL,
  `banco` varchar(40) DEFAULT NULL,
  `direccion_banco` varchar(40) DEFAULT NULL,
  `poblacion_banco` varchar(40) DEFAULT NULL,
  `provincia_banco` varchar(20) DEFAULT NULL,
  `distrito_banco` varchar(5) DEFAULT NULL,
  `cuenta_corriente` varchar(24) DEFAULT NULL,
  `descuento` decimal(5,2) DEFAULT NULL,
  `cuota_servicios_distintos_pro` decimal(12,2) DEFAULT NULL,
  `fecha_m` datetime DEFAULT NULL,
  `usu_m` varchar(8) DEFAULT NULL,
  `comercial` int(11) DEFAULT NULL,
  `comision_1ano` decimal(5,2) DEFAULT NULL,
  `comision_2abo` decimal(5,2) DEFAULT NULL,
  `comision_tari_espe` decimal(5,2) DEFAULT NULL,
  `comision_profe` decimal(5,2) DEFAULT NULL,
  `codigo_iva` smallint(6) DEFAULT NULL,
  `liquidacion_rappel` varchar(1) DEFAULT NULL,
  `rappel1` decimal(12,2) DEFAULT NULL,
  `rappel_dto1` decimal(8,2) DEFAULT NULL,
  `rappel2` decimal(12,2) DEFAULT NULL,
  `rappel_dto2` decimal(8,2) DEFAULT NULL,
  `rappel3` decimal(12,2) DEFAULT NULL,
  `codig_iva_especial` varchar(1) DEFAULT NULL,
  `rappel4` decimal(12,2) DEFAULT NULL,
  `rappel_dto4` decimal(5,2) DEFAULT NULL,
  `rappel_dto3` decimal(5,2) DEFAULT NULL,
  `fech_ult_liqui` datetime DEFAULT NULL,
  `rappel1_comercial` decimal(5,2) DEFAULT NULL,
  `rappel2_comercial` decimal(5,2) DEFAULT NULL,
  `rappel3_comercial` decimal(5,2) DEFAULT NULL,
  `rappel4_comercial` decimal(5,2) DEFAULT NULL,
  `dto_correccion` decimal(5,2) DEFAULT NULL,
  `fecha_ulti_parcial` datetime DEFAULT NULL,
  `fech_ult_liqui_c` datetime DEFAULT NULL,
  `fecha_ulti_parcial_c` datetime DEFAULT NULL,
  `fant_lperiodo_cli` datetime DEFAULT NULL,
  `fant_parcial_cli` datetime DEFAULT NULL,
  `fant_lperiodo_com` datetime DEFAULT NULL,
  `fant_parcial_com` datetime DEFAULT NULL,
  `limite_credito` decimal(15,0) DEFAULT NULL,
  `limite_credito_eu` decimal(15,2) DEFAULT NULL,
  `empresa_fija` varchar(4) DEFAULT NULL,
  `tiene_liquidacion` varchar(1) DEFAULT NULL,
  `liquida_agrupacion` varchar(1) DEFAULT NULL,
  `zona` varchar(5) DEFAULT NULL,
  `dia1_pago` smallint(6) DEFAULT NULL,
  `dia2_pago` smallint(6) DEFAULT NULL,
  `dia3_pago` smallint(6) DEFAULT NULL,
  `dia4_pago` smallint(6) DEFAULT NULL,
  `mes_sefectos` smallint(6) DEFAULT NULL,
  `agrupacion` varchar(4) DEFAULT NULL,
  `informe_financiero` varchar(20) DEFAULT NULL,
  `factura_por_siniestro` varchar(1) DEFAULT NULL,
  `recargo` varchar(1) DEFAULT NULL,
  `cuenta_contable` decimal(10,0) DEFAULT NULL,
  `multiempresa` varchar(1) DEFAULT NULL,
  `mail_envio_fras` mediumtext,
  `envio_fras` varchar(1) DEFAULT NULL,
  `codigo_pais` varchar(4) DEFAULT NULL,
  `cuenta_iban` varchar(30) DEFAULT NULL,
  `tipo_adeudo` varchar(4) DEFAULT NULL,
  `fecha_firma_mandato` datetime DEFAULT NULL,
  `referencia_mandato` varchar(35) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `tipoViaId` int(11) DEFAULT NULL,
  `nombreComercial` varchar(255) DEFAULT NULL,
  `agrupacion` varchar(255) DEFAULT NULL,
  `direccion2` varchar(255) DEFAULT NULL,
  `codPostal2` varchar(255) DEFAULT NULL,
  `poblacion2` varchar(255) DEFAULT NULL,
  `provincia2` varchar(255) DEFAULT NULL,
  `tipoViaId2` int(11) DEFAULT NULL,
  `motivoBajaId` int(11) DEFAULT NULL,
  `dniFirmante` varchar(255) DEFAULT NULL,
  `firmante` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`clienteId`),
  KEY `fkey_forma_pago` (`formaPagoId`),
  KEY `fkey_tipo_cliente` (`tipoClienteId`),
  KEY `ref_cliente_via` (`tipoViaId`),
  KEY `ref_cliente_via2` (`tipoViaId2`),
  KEY `ref_cliente_motivos` (`motivoBajaId`),
  CONSTRAINT `fkey_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `fkey_tipo_cliente` FOREIGN KEY (`tipoClienteId`) REFERENCES `tipos_clientes` (`tipoClienteId`),
  CONSTRAINT `ref_cliente_motivos` FOREIGN KEY (`motivoBajaId`) REFERENCES `motivos_baja` (`motivoBajaId`),
  CONSTRAINT `ref_cliente_via` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via` (`tipoViaId`),
  CONSTRAINT `ref_cliente_via2` FOREIGN KEY (`tipoViaId2`) REFERENCES `tipos_via` (`tipoViaId`)
) ENGINE=InnoDB AUTO_INCREMENT=39835 DEFAULT CHARSET=utf8;

/*Table structure for table `clientes_comisionistas` */

DROP TABLE IF EXISTS `clientes_comisionistas`;

CREATE TABLE `clientes_comisionistas` (
  `clienteComisionistaId` int(11) NOT NULL AUTO_INCREMENT,
  `clienteId` int(11) DEFAULT NULL,
  `comercialId` int(11) DEFAULT NULL,
  `manPorVentaNeta` decimal(5,2) DEFAULT NULL,
  `manPorBeneficio` decimal(5,2) DEFAULT NULL,
  `porComer` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`clienteComisionistaId`),
  KEY `ref_cc_cliente` (`clienteId`),
  KEY `ref_cc_comercial` (`comercialId`),
  CONSTRAINT `ref_cc_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `ref_cc_comercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

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
  `iban` varchar(255) DEFAULT NULL,
  `porComer` decimal(5,2) DEFAULT NULL,
  `tipoViaId` int(11) DEFAULT NULL,
  `motivoBajaId` int(11) DEFAULT NULL,
  PRIMARY KEY (`comercialId`),
  KEY `fkey_comercial_forma_pago` (`formaPagoId`),
  KEY `fkey_comercial_comercial` (`ascComercialId`),
  KEY `ref_comercial_via` (`tipoViaId`),
  KEY `ref_comercial_motivo` (`motivoBajaId`),
  CONSTRAINT `fkey_comercial_comercial` FOREIGN KEY (`ascComercialId`) REFERENCES `comerciales` (`comercialId`),
  CONSTRAINT `fkey_comercial_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `ref_comercial_motivo` FOREIGN KEY (`motivoBajaId`) REFERENCES `motivos_baja` (`motivoBajaId`),
  CONSTRAINT `ref_comercial_via` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via` (`tipoViaId`)
) ENGINE=InnoDB AUTO_INCREMENT=659 DEFAULT CHARSET=utf8;

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
  `diaPago` int(11) DEFAULT NULL,
  `preaviso` int(11) DEFAULT NULL,
  `fechaFactura` date DEFAULT NULL,
  `facturaParcial` tinyint(1) DEFAULT NULL,
  `tipoMantenimientoId` int(11) DEFAULT NULL,
  `formaPagoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`contratoClienteMantenimientoId`),
  KEY `ref_ccm_empresa` (`empresaId`),
  KEY `ref_ccm_mantenedor` (`mantenedorId`),
  KEY `ref_ccm_cliente` (`clienteId`),
  KEY `ref_ccm_articulo` (`articuloId`),
  KEY `ref_ccm_tipomantenimiento` (`tipoMantenimientoId`),
  KEY `ref_ccm_forma_pago` (`formaPagoId`),
  CONSTRAINT `ref_ccm_articulo` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `ref_ccm_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `ref_ccm_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `ref_ccm_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `ref_ccm_mantenedor` FOREIGN KEY (`mantenedorId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `ref_ccm_tipomantenimiento` FOREIGN KEY (`tipoMantenimientoId`) REFERENCES `tipos_mantenimiento` (`tipoMantenimientoId`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

/*Table structure for table `contrato_cliente_mantenimiento_comisionistas` */

DROP TABLE IF EXISTS `contrato_cliente_mantenimiento_comisionistas`;

CREATE TABLE `contrato_cliente_mantenimiento_comisionistas` (
  `contratoClienteMantenimientoComisionistaId` int(11) NOT NULL AUTO_INCREMENT,
  `contratoClienteMantenimientoId` int(11) DEFAULT NULL,
  `comercialId` int(11) DEFAULT NULL,
  `porVentaNeta` decimal(5,2) DEFAULT NULL,
  `porBeneficio` decimal(5,2) DEFAULT NULL,
  `porComer` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`contratoClienteMantenimientoComisionistaId`),
  KEY `ref_ccmc_ccm` (`contratoClienteMantenimientoId`),
  KEY `ref_ccmc_comercial` (`comercialId`),
  CONSTRAINT `ref_ccmc_ccm` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `ref_ccmc_comercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;

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
  `manComisAgente` tinyint(1) DEFAULT '0',
  `manPorImpCliente` decimal(5,2) DEFAULT '0.00',
  `manPorImpClienteAgente` decimal(5,2) DEFAULT '0.00',
  `manPorCostes` decimal(5,2) DEFAULT '0.00',
  `manCostes` tinyint(1) DEFAULT '0',
  `manJefeObra` tinyint(1) DEFAULT '0',
  `manOficinaTecnica` tinyint(1) DEFAULT '0',
  `manAsesorTecnico` tinyint(1) DEFAULT '0',
  `manComercial` tinyint(1) DEFAULT '0',
  `comision` decimal(5,2) DEFAULT '0.00',
  `manComision` decimal(5,2) DEFAULT '0.00',
  `segComisAgente` tinyint(1) DEFAULT '0',
  `segPorImpCliente` decimal(5,2) DEFAULT '0.00',
  `segPorImpClienteAgente` decimal(5,2) DEFAULT '0.00',
  `segPorCostes` decimal(5,2) DEFAULT '0.00',
  `segCostes` tinyint(1) DEFAULT '0',
  `segJefeObra` tinyint(1) DEFAULT '0',
  `segOficinaTecnica` tinyint(1) DEFAULT '0',
  `segAsesorTecnico` tinyint(1) DEFAULT '0',
  `segComercial` tinyint(1) DEFAULT '0',
  `segComision` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`contratoComercialId`),
  UNIQUE KEY `idx_empresa_comercial` (`empresaId`,`comercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Table structure for table `contratos` */

DROP TABLE IF EXISTS `contratos`;

CREATE TABLE `contratos` (
  `contratoId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de el contrato como contador autoincremental',
  `tipoContratoId` int(11) NOT NULL COMMENT 'Tipo de el contrato = tipo mantenimiento',
  `referencia` varchar(255) NOT NULL COMMENT 'Referencia de el contrato pa5ra búsquedas',
  `tipoProyectoId` int(11) DEFAULT NULL,
  `empresaId` int(11) NOT NULL COMMENT 'Empresa propia que realiza el contrato',
  `clienteId` int(11) NOT NULL COMMENT 'Cliente final al que va dirigida el contrato',
  `mantenedorId` int(11) DEFAULT NULL COMMENT 'Mantenedor (si es que lo hay) que media en el contrato',
  `agenteId` int(11) DEFAULT NULL COMMENT 'Agente (comerciales) que se asocia a el contrato',
  `fechaContrato` date NOT NULL COMMENT 'Fecha de creación de el contrato',
  `coste` decimal(12,2) NOT NULL COMMENT 'Coste global de el contrato',
  `porcentajeBeneficio` decimal(5,2) NOT NULL COMMENT '% sobre el coste para calcular beneficio',
  `importeBeneficio` decimal(12,2) NOT NULL COMMENT 'Importe del beneficio',
  `ventaNeta` decimal(12,2) NOT NULL COMMENT 'Coste + Beneficio',
  `porcentajeAgente` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje de comision del agente (sobre importeCliente)',
  `importeAgente` decimal(12,2) DEFAULT NULL COMMENT 'Importe del agente',
  `importeCliente` decimal(12,2) NOT NULL COMMENT 'VentaNeta + ImporteAgente',
  `importeMantenedor` decimal(12,2) DEFAULT NULL COMMENT 'ImporteMantenedor = ImporteCliente - VentaNeta + beneficio',
  `observaciones` text,
  `formaPagoId` int(11) DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `totalConIva` decimal(12,2) DEFAULT NULL,
  `fechaInicio` date DEFAULT NULL,
  `fechaFinal` date DEFAULT NULL,
  `fechaPrimeraFactura` date DEFAULT NULL,
  `ofertaId` int(11) DEFAULT NULL COMMENT 'Referencia a la  oferta de la que proviene',
  `fechaOriginal` date DEFAULT NULL COMMENT 'En las renovaciones de ciontrato la fecha del contrato original',
  `facturaParcial` tinyint(1) DEFAULT '0',
  `preaviso` int(11) DEFAULT NULL COMMENT 'Meses de preaviso',
  PRIMARY KEY (`contratoId`),
  KEY `cnt_tipoMantenimiento` (`tipoContratoId`),
  KEY `cnt_empresa` (`empresaId`),
  KEY `cnt_cliente` (`clienteId`),
  KEY `cnt_mantenedor` (`mantenedorId`),
  KEY `cnt_agente` (`agenteId`),
  KEY `cnt_formaPago` (`formaPagoId`),
  KEY `cnt_tipoProyecto` (`tipoProyectoId`),
  KEY `cnt_oferta` (`ofertaId`),
  CONSTRAINT `cnt_agente` FOREIGN KEY (`agenteId`) REFERENCES `comerciales` (`comercialId`),
  CONSTRAINT `cnt_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `cnt_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `cnt_formaPago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `cnt_mantenedor` FOREIGN KEY (`mantenedorId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `cnt_oferta` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas` (`ofertaId`) ON DELETE NO ACTION,
  CONSTRAINT `cnt_tipoMantenimiento` FOREIGN KEY (`tipoContratoId`) REFERENCES `tipos_mantenimiento` (`tipoMantenimientoId`),
  CONSTRAINT `cnt_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto` (`tipoProyectoId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

/*Table structure for table `contratos_bases` */

DROP TABLE IF EXISTS `contratos_bases`;

CREATE TABLE `contratos_bases` (
  `contratoBaseId` int(11) NOT NULL AUTO_INCREMENT,
  `contratoId` int(11) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `base` decimal(12,2) DEFAULT NULL,
  `cuota` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`contratoBaseId`),
  UNIQUE KEY `cntb_prefac_iva` (`contratoId`,`tipoIvaId`),
  KEY `cntb_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `cntb_contratos` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`) ON DELETE CASCADE,
  CONSTRAINT `cntb_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=277 DEFAULT CHARSET=utf8;

/*Table structure for table `contratos_comisionistas` */

DROP TABLE IF EXISTS `contratos_comisionistas`;

CREATE TABLE `contratos_comisionistas` (
  `contratoComisionistaId` int(11) NOT NULL AUTO_INCREMENT,
  `contratoId` int(11) DEFAULT NULL,
  `comercialId` int(11) DEFAULT NULL,
  `porcentajeComision` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`contratoComisionistaId`),
  KEY `cnt_comisonista_coercial` (`comercialId`),
  KEY `cnt_comisionista_contrato` (`contratoId`),
  CONSTRAINT `cnt_comisionista_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`) ON DELETE CASCADE,
  CONSTRAINT `cnt_comisonista_coercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Table structure for table `contratos_lineas` */

DROP TABLE IF EXISTS `contratos_lineas`;

CREATE TABLE `contratos_lineas` (
  `contratoLineaId` int(11) NOT NULL AUTO_INCREMENT,
  `linea` decimal(6,3) DEFAULT NULL,
  `contratoId` int(11) DEFAULT NULL,
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
  PRIMARY KEY (`contratoLineaId`),
  KEY `cntl_contratos` (`contratoId`),
  KEY `cntl_articulos` (`articuloId`),
  KEY `cntl_tipos_iva` (`tipoIvaId`),
  KEY `cntl_unidades` (`unidadId`),
  CONSTRAINT `cntl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `cntl_contratos` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`) ON DELETE CASCADE,
  CONSTRAINT `cntl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`),
  CONSTRAINT `cntl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8;

/*Table structure for table `cuentas` */

DROP TABLE IF EXISTS `cuentas`;

CREATE TABLE `cuentas` (
  `cuenta` varchar(10) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `nif` varchar(15) DEFAULT NULL,
  `codigo` int(11) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  PRIMARY KEY (`cuenta`),
  KEY `idx_nif` (`nif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `cuentas_import` */

DROP TABLE IF EXISTS `cuentas_import`;

CREATE TABLE `cuentas_import` (
  `cuenta` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `nif` varchar(15) DEFAULT NULL,
  `codigo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `disnif` */

DROP TABLE IF EXISTS `disnif`;

CREATE TABLE `disnif` (
  `nif` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `tipoViaId` int(11) DEFAULT NULL,
  `seriePre` varchar(255) DEFAULT NULL,
  `serieFac` varchar(255) DEFAULT NULL,
  `serieFacS` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`empresaId`),
  KEY `ref_empresa_via` (`tipoViaId`),
  CONSTRAINT `ref_empresa_via` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via` (`tipoViaId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Table structure for table `facturas` */

DROP TABLE IF EXISTS `facturas`;

CREATE TABLE `facturas` (
  `facturaId` int(11) NOT NULL AUTO_INCREMENT,
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
  `totalAlCliente` decimal(12,2) DEFAULT NULL,
  `coste` decimal(12,2) DEFAULT NULL,
  `generada` tinyint(1) DEFAULT '1',
  `porcentajeBeneficio` decimal(5,2) DEFAULT NULL,
  `porcentajeAgente` decimal(5,2) DEFAULT NULL,
  `contratoId` int(11) DEFAULT NULL,
  `contafich` varchar(255) DEFAULT NULL COMMENT 'Nombre del fichero de exportación a contabilidad',
  `prefacturaId` int(11) DEFAULT NULL,
  PRIMARY KEY (`facturaId`),
  KEY `fac_empresas` (`empresaId`),
  KEY `fac_clientes` (`clienteId`),
  KEY `fac_formas_pago` (`formaPagoId`),
  KEY `fac_contratos` (`contratoClienteMantenimientoId`),
  KEY `fac_tipoProyecto` (`tipoProyectoId`),
  KEY `fac_contrato` (`contratoId`),
  KEY `fac_prefacturas` (`prefacturaId`),
  CONSTRAINT `fac_clientes` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `fac_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`),
  CONSTRAINT `fac_contratos` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `fac_empresas` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `fac_formas_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `fac_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `prefacturas` (`prefacturaId`),
  CONSTRAINT `fac_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto` (`tipoProyectoId`)
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8;

/*Table structure for table `facturas_bases` */

DROP TABLE IF EXISTS `facturas_bases`;

CREATE TABLE `facturas_bases` (
  `facturaBaseId` int(11) NOT NULL AUTO_INCREMENT,
  `facturaId` int(11) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `base` decimal(12,2) DEFAULT NULL,
  `cuota` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`facturaBaseId`),
  UNIQUE KEY `factb_prefac_iva` (`facturaId`,`tipoIvaId`),
  KEY `factb_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `factb_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`) ON DELETE CASCADE,
  CONSTRAINT `factb_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=292 DEFAULT CHARSET=utf8;

/*Table structure for table `facturas_lineas` */

DROP TABLE IF EXISTS `facturas_lineas`;

CREATE TABLE `facturas_lineas` (
  `facturaLineaId` int(11) NOT NULL AUTO_INCREMENT,
  `linea` decimal(6,3) DEFAULT NULL,
  `facturaId` int(11) DEFAULT NULL,
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
  PRIMARY KEY (`facturaLineaId`),
  KEY `factl_facturas` (`facturaId`),
  KEY `factl_articulos` (`articuloId`),
  KEY `factl_tipos_iva` (`tipoIvaId`),
  KEY `factl_unidades` (`unidadId`),
  CONSTRAINT `factl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `factl_facturas` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`) ON DELETE CASCADE,
  CONSTRAINT `factl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`),
  CONSTRAINT `factl_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Table structure for table `grupo_articulo` */

DROP TABLE IF EXISTS `grupo_articulo`;

CREATE TABLE `grupo_articulo` (
  `grupoArticuloId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`grupoArticuloId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

/*Table structure for table `liquidacion_comercial` */

DROP TABLE IF EXISTS `liquidacion_comercial`;

CREATE TABLE `liquidacion_comercial` (
  `liquidacionComercialId` int(11) NOT NULL AUTO_INCREMENT,
  `facturaId` int(11) DEFAULT NULL,
  `comercialId` int(11) DEFAULT NULL,
  `contratoClienteMantenimientoId` int(11) DEFAULT NULL,
  `impCliente` decimal(12,2) DEFAULT NULL,
  `coste` decimal(12,2) DEFAULT NULL,
  `CA` decimal(12,2) DEFAULT NULL,
  `PC` decimal(12,2) DEFAULT NULL,
  `PCA` decimal(12,2) DEFAULT NULL,
  `PCO` decimal(12,2) DEFAULT NULL,
  `ICO` decimal(12,2) DEFAULT NULL,
  `IJO` decimal(12,2) DEFAULT NULL,
  `IOT` decimal(12,2) DEFAULT NULL,
  `IAT` decimal(12,2) DEFAULT NULL,
  `IC` decimal(12,2) DEFAULT NULL,
  `porComer` decimal(5,2) DEFAULT NULL,
  `base` decimal(12,2) DEFAULT NULL,
  `comision` decimal(12,2) DEFAULT NULL,
  `contratoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`liquidacionComercialId`),
  KEY `liq_comer_factura` (`facturaId`),
  KEY `liq_comer_comercial` (`comercialId`),
  KEY `liq_comer_contrato` (`contratoClienteMantenimientoId`),
  KEY `liq_comer_contratos` (`contratoId`),
  CONSTRAINT `liq_comer_comercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales` (`comercialId`),
  CONSTRAINT `liq_comer_contrato` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento` (`contratoClienteMantenimientoId`),
  CONSTRAINT `liq_comer_contratos` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`),
  CONSTRAINT `liq_comer_factura` FOREIGN KEY (`facturaId`) REFERENCES `facturas` (`facturaId`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1;

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

/*Table structure for table `motivos_baja` */

DROP TABLE IF EXISTS `motivos_baja`;

CREATE TABLE `motivos_baja` (
  `motivoBajaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`motivoBajaId`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

/*Table structure for table `ofertas` */

DROP TABLE IF EXISTS `ofertas`;

CREATE TABLE `ofertas` (
  `ofertaId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la oferta como contador autoincremental',
  `tipoOfertaId` int(11) NOT NULL COMMENT 'Tipo de la oferta = tipo mantenimiento',
  `referencia` varchar(255) NOT NULL COMMENT 'Referencia de la oferta pa5ra búsquedas',
  `tipoProyectoId` int(11) DEFAULT NULL,
  `empresaId` int(11) NOT NULL COMMENT 'Empresa propia que realiza la oferta',
  `clienteId` int(11) NOT NULL COMMENT 'Cliente final al que va dirigida la oferta',
  `mantenedorId` int(11) DEFAULT NULL COMMENT 'Mantenedor (si es que lo hay) que media en la oferta',
  `agenteId` int(11) DEFAULT NULL COMMENT 'Agente (comerciales) que se asocia a la oferta',
  `fechaOferta` date NOT NULL COMMENT 'Fecha de creación de la oferta',
  `coste` decimal(12,2) NOT NULL COMMENT 'Coste global de la oferta',
  `porcentajeBeneficio` decimal(5,2) NOT NULL COMMENT '% sobre el coste para calcular beneficio',
  `importeBeneficio` decimal(12,2) NOT NULL COMMENT 'Importe del beneficio',
  `ventaNeta` decimal(12,2) NOT NULL COMMENT 'Coste + Beneficio',
  `porcentajeAgente` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje de comision del agente (sobre importeCliente)',
  `importeAgente` decimal(12,2) DEFAULT NULL COMMENT 'Importe del agente',
  `importeCliente` decimal(12,2) NOT NULL COMMENT 'VentaNeta + ImporteAgente',
  `importeMantenedor` decimal(12,2) DEFAULT NULL COMMENT 'ImporteMantenedor = ImporteCliente - VentaNeta + beneficio',
  `observaciones` text,
  `formaPagoId` int(11) DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `totalConIva` decimal(12,2) DEFAULT NULL,
  `fechaAceptacionOferta` date DEFAULT NULL,
  `contratoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`ofertaId`),
  KEY `of_tipoMantenimiento` (`tipoOfertaId`),
  KEY `of_empresa` (`empresaId`),
  KEY `of_cliente` (`clienteId`),
  KEY `of_mantenedor` (`mantenedorId`),
  KEY `of_agente` (`agenteId`),
  KEY `of_formaPago` (`formaPagoId`),
  KEY `of_tipoProyecto` (`tipoProyectoId`),
  KEY `of_contrato` (`contratoId`),
  CONSTRAINT `of_agente` FOREIGN KEY (`agenteId`) REFERENCES `comerciales` (`comercialId`),
  CONSTRAINT `of_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `of_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos` (`contratoId`) ON DELETE NO ACTION,
  CONSTRAINT `of_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`),
  CONSTRAINT `of_formaPago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago` (`formaPagoId`),
  CONSTRAINT `of_mantenedor` FOREIGN KEY (`mantenedorId`) REFERENCES `clientes` (`clienteId`),
  CONSTRAINT `of_tipoMantenimiento` FOREIGN KEY (`tipoOfertaId`) REFERENCES `tipos_mantenimiento` (`tipoMantenimientoId`),
  CONSTRAINT `of_tipoProyecto` FOREIGN KEY (`tipoProyectoId`) REFERENCES `tipos_proyecto` (`tipoProyectoId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Table structure for table `ofertas_bases` */

DROP TABLE IF EXISTS `ofertas_bases`;

CREATE TABLE `ofertas_bases` (
  `ofertaBaseId` int(11) NOT NULL AUTO_INCREMENT,
  `ofertaId` int(11) DEFAULT NULL,
  `tipoIvaId` int(11) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `base` decimal(12,2) DEFAULT NULL,
  `cuota` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`ofertaBaseId`),
  UNIQUE KEY `ofb_prefac_iva` (`ofertaId`,`tipoIvaId`),
  KEY `ofb_tipos_iva` (`tipoIvaId`),
  CONSTRAINT `ofb_ofertas` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas` (`ofertaId`) ON DELETE CASCADE,
  CONSTRAINT `ofb_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=273 DEFAULT CHARSET=utf8;

/*Table structure for table `ofertas_lineas` */

DROP TABLE IF EXISTS `ofertas_lineas`;

CREATE TABLE `ofertas_lineas` (
  `ofertaLineaId` int(11) NOT NULL AUTO_INCREMENT,
  `linea` decimal(6,3) DEFAULT NULL,
  `ofertaId` int(11) DEFAULT NULL,
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
  PRIMARY KEY (`ofertaLineaId`),
  KEY `ofl_ofertas` (`ofertaId`),
  KEY `ofl_articulos` (`articuloId`),
  KEY `ofl_tipos_iva` (`tipoIvaId`),
  KEY `ofl_unidad` (`unidadId`),
  CONSTRAINT `ofl_articulos` FOREIGN KEY (`articuloId`) REFERENCES `articulos` (`articuloId`),
  CONSTRAINT `ofl_ofertas` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas` (`ofertaId`) ON DELETE CASCADE,
  CONSTRAINT `ofl_tipos_iva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva` (`tipoIvaId`),
  CONSTRAINT `ofl_unidad` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=196 DEFAULT CHARSET=utf8;

/*Table structure for table `parametros` */

DROP TABLE IF EXISTS `parametros`;

CREATE TABLE `parametros` (
  `parametroId` int(11) NOT NULL,
  `articuloMantenimiento` int(11) DEFAULT NULL,
  `margenMantenimiento` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`parametroId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=234 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=284 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8;

/*Table structure for table `textos_predeterminados` */

DROP TABLE IF EXISTS `textos_predeterminados`;

CREATE TABLE `textos_predeterminados` (
  `textoPredeterminadoId` int(11) NOT NULL AUTO_INCREMENT,
  `texto` text,
  `abrev` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`textoPredeterminadoId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Table structure for table `tipos_clientes` */

DROP TABLE IF EXISTS `tipos_clientes`;

CREATE TABLE `tipos_clientes` (
  `tipoClienteId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoClienteId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `tipos_comerciales` */

DROP TABLE IF EXISTS `tipos_comerciales`;

CREATE TABLE `tipos_comerciales` (
  `tipoComercialId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoComercialId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `tipos_forma_pago` */

DROP TABLE IF EXISTS `tipos_forma_pago`;

CREATE TABLE `tipos_forma_pago` (
  `tipoFormaPagoId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoFormaPagoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `tipos_iva` */

DROP TABLE IF EXISTS `tipos_iva`;

CREATE TABLE `tipos_iva` (
  `tipoIvaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `codigoContable` int(11) DEFAULT NULL,
  PRIMARY KEY (`tipoIvaId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Table structure for table `tipos_mantenimiento` */

DROP TABLE IF EXISTS `tipos_mantenimiento`;

CREATE TABLE `tipos_mantenimiento` (
  `tipoMantenimientoId` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoMantenimientoId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tipos_proyecto` */

DROP TABLE IF EXISTS `tipos_proyecto`;

CREATE TABLE `tipos_proyecto` (
  `tipoProyectoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `abrev` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoProyectoId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

/*Table structure for table `tipos_via` */

DROP TABLE IF EXISTS `tipos_via`;

CREATE TABLE `tipos_via` (
  `tipoViaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipoViaId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Table structure for table `unidades` */

DROP TABLE IF EXISTS `unidades`;

CREATE TABLE `unidades` (
  `unidadId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `abrev` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`unidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

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

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
