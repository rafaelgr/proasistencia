DROP TABLE IF EXISTS `contrato_planificacion_temporal`;

CREATE TABLE `contrato_planificacion_temporal` (
  `contPlanificacionTempId` int(11) NOT NULL auto_increment,
  `contratoId` int(11) default NULL,
  `concepto` varchar(255) default NULL,
  `porcentaje` decimal(12, 2) default NULL,
  `porRetenGarantias` decimal(4, 2) default '0.00',
  `fecha` date default NULL,
  `importe` decimal(12, 2) default NULL,
  `importePrefacturado` decimal(12, 2) default '0.00',
  `importeFacturado` decimal(12, 2) default '0.00',
  `importeFacturadoIva` decimal(12, 2) default '0.00',
  `importeCobrado` decimal(12, 2) default '0.00',
  `formaPagoId` int(11) default NULL,
  PRIMARY KEY (`contPlanificacionTempId`),
  KEY `contratos_planificacionFK` (`contratoId`),
  KEY `formaPago_planificacionFK` (`formaPagoId`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*Table structure for table `prefacturas_bases_temporal` */
DROP TABLE IF EXISTS `prefacturas_bases_temporal`;

CREATE TABLE `prefacturas_bases_temporal` (
  `prefacturaBasetempId` int(11) NOT NULL auto_increment,
  `prefacturaTempId` int(11) default NULL,
  `tipoIvaId` int(11) default NULL,
  `porcentaje` decimal(5, 2) default NULL,
  `base` decimal(12, 2) default NULL,
  `cuota` decimal(12, 2) default NULL,
  PRIMARY KEY (`prefacturaBasetempId`),
  UNIQUE KEY `prefb_prefac_iva` (`prefacturaTempId`, `tipoIvaId`),
  KEY `prefb_tipos_iva` (`tipoIvaId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

/*Table structure for table `prefacturas_lineas_temporal` */
DROP TABLE IF EXISTS `prefacturas_lineas_temporal`;

CREATE TABLE `prefacturas_lineas_temporal` (
  `prefacturaLineaTempId` int(11) NOT NULL auto_increment,
  `linea` decimal(6, 3) default NULL,
  `prefacturaTempId` int(11) default NULL,
  `unidadId` int(11) default NULL,
  `articuloId` int(11) default NULL,
  `tipoIvaId` int(11) default NULL,
  `porcentaje` decimal(5, 2) default NULL,
  `descripcion` text,
  `cantidad` decimal(6, 2) default NULL,
  `importe` decimal(14, 4) default NULL,
  `totalLinea` decimal(12, 2) default NULL,
  `coste` decimal(14, 4) default NULL,
  `porcentajeBeneficio` decimal(9, 6) default NULL,
  `importeBeneficioLinea` decimal(12, 2) default '0.00',
  `porcentajeAgente` decimal(5, 2) default NULL,
  `importeAgenteLinea` decimal(12, 2) default '0.00',
  `ventaNetaLinea` decimal(12, 2) default '0.00',
  `capituloLinea` varchar(255) default NULL,
  PRIMARY KEY (`prefacturaLineaTempId`),
  KEY `prefl_articulos` (`articuloId`),
  KEY `prefl_tipos_iva` (`tipoIvaId`),
  KEY `prefl_unidades` (`unidadId`),
  KEY `prefl_prefacturas` (`prefacturaTempId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

/*Table structure for table `prefacturas_temporal` */
DROP TABLE IF EXISTS `prefacturas_temporal`;

CREATE TABLE `prefacturas_temporal` (
  `prefacturaTempId` int(11) NOT NULL auto_increment,
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
  `total` decimal(12, 2) default NULL,
  `totalConIva` decimal(12, 2) default NULL,
  `formaPagoId` int(11) default NULL,
  `observaciones` text,
  `sel` tinyint(1) default '0',
  `facturaId` int(11) default NULL,
  `totalAlCliente` decimal(12, 2) default NULL,
  `restoCobrar` decimal(12, 2) default '0.00',
  `coste` decimal(14, 4) default NULL,
  `generada` tinyint(1) default '1',
  `porcentajeBeneficio` decimal(9, 6) default NULL,
  `porcentajeAgente` decimal(5, 2) default NULL,
  `contratoId` int(11) default NULL,
  `periodo` varchar(255) default NULL,
  `obsFactura` text,
  `porcentajeRetencion` decimal(4, 2) default NULL,
  `importeRetencion` decimal(12, 2) default NULL,
  `retenGarantias` decimal(12, 2) default '0.00',
  `mantenedorDesactivado` tinyint(1) default '0',
  `departamentoId` int(11) default NULL,
  `noCalculadora` tinyint(1) default '0',
  `observacionesPago` text,
  `contratoPorcenId` int(11) default NULL,
  `contPlanificacionId` int(11) default NULL,
  `fechaRecibida` date default NULL,
  `fechaGestionCobros` date default NULL,
  `numLetra` varchar(255) default '',
  `beneficioLineal` tinyint(1) default '0',
  PRIMARY KEY (`prefacturaTempId`),
  KEY `pref_empresas` (`empresaId`),
  KEY `pref_clientes` (`clienteId`),
  KEY `pref_formas_pago` (`formaPagoId`),
  KEY `pref_contratos` (`contratoClienteMantenimientoId`),
  KEY `pref_facturas` (`facturaId`),
  KEY `pf_tipoProyecto` (`tipoProyectoId`),
  KEY `pref_contrato` (`contratoId`),
  KEY `pref_departamentos` (`departamentoId`),
  KEY `pref_conceptoPorcen` (`contratoPorcenId`),
  KEY `pref_contratoPlanicicacion` (`contPlanificacionId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

ALTER TABLE
  `prefacturas_temporal` CHANGE `contPlanificacionId` `contPlanificacionTempId` INT(11) NULL,
  DROP INDEX `pref_contratoPlanicicacion`,
ADD
  KEY `pref_contratoPlanicicacion` (`contPlanificacionTempId`);

ALTER TABLE
  `prefacturas_bases_temporal`
ADD
  CONSTRAINT `prefb_prefacturas_temp` FOREIGN KEY (`prefacturaTempId`) REFERENCES `prefacturas_temporal`(`prefacturaTempId`) ON DELETE CASCADE;

ALTER TABLE
  `prefacturas_lineas_temporal`
ADD
  CONSTRAINT `prefl_pref_temporal` FOREIGN KEY (`prefacturaTempId`) REFERENCES `prefacturas_temporal`(`prefacturaTempId`) ON DELETE CASCADE;

ALTER TABLE
  `contrato_planificacion`
ADD
  COLUMN `contPlanificacionTempId` INT(11) NULL
AFTER
  `formaPagoId`,
ADD
  CONSTRAINT `contPlanificacion_temp_FK` FOREIGN KEY (`contPlanificacionTempId`) REFERENCES `contrato_planificacion_temporal`(`contPlanificacionTempId`);

ALTER TABLE
  contrato_planificacion
ADD
  UNIQUE INDEX idx_tempId (contPlanificacionTempId);

ALTER TABLE
  `contratos`
ADD
  COLUMN `contratoInteresesId` TINYINT(1) DEFAULT 0 NULL
AFTER
  `visulizaEnErp`;

ALTER TABLE
  `contratos`
ADD
  COLUMN `fechaJunta` DATE NULL
AFTER
  `contratoInteresesId`;

ALTER TABLE
  `contrato_planificacion_temporal`
ADD
  COLUMN `esAdicional` TINYINT(1) DEFAULT 0 NULL
AFTER
  `formaPagoId`;

ALTER TABLE
  `contrato_planificacion_temporal`
ADD
  COLUMN `contratoAdicionalId` INT(11) NULL
AFTER
  `esAdicional`;

ALTER TABLE
  `contrato_planificacion_temporal`
ADD
  COLUMN `refPresupuestoAdicional` VARCHAR(211) NULL
AFTER
  `contratoAdicionalId`;

ALTER TABLE
  `contrato_planificacion_temporal`
ADD
  COLUMN `importeIntereses` DECIMAL(12, 2) NULL
AFTER
  `refPresupuestoAdicional`;

ALTER TABLE
  `contrato_planificacion_temporal`
ADD
  COLUMN `contPlanificacionTempIntId` INT(11) NULL
AFTER
  `importeIntereses`,
ADD
  KEY `comtPlanificacionTemp_contPlanificacionTempIntereses` (`contPlanificacionTempIntId`);

ALTER TABLE
  `contratos`
ADD
  CONSTRAINT `contrato_interesesFK` FOREIGN KEY (`contratoInteresesId`) REFERENCES `contratos`(`contratoId`) ON DELETE
SET
  NULL;

ALTER TABLE
  `contrato_planificacion_temporal`
ADD
  CONSTRAINT `comtPlanificacionTemp_contPlanificacionTempInteresesFK` FOREIGN KEY (`contPlanificacionTempIntId`) REFERENCES `contrato_planificacion_temporal`(`contPlanificacionTempId`) ON DELETE
SET
  NULL;

ALTER TABLE
  `contratos`
ADD
  CONSTRAINT `contrato_intereseesFK` FOREIGN KEY (`contratoInteresesId`) REFERENCES `contratos`(`contratoId`) ON DELETE
SET
  NULL;

ALTER TABLE
  `contrato_planificacion_temporal`
ADD
  CONSTRAINT `planificacionTemp_comtratoFK` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`) ON DELETE CASCADE;

ALTER TABLE
  `contrato_planificacion_temporal`
ADD
  COLUMN `externa` TINYINT(1) DEFAULT 0 NULL
AFTER
  `contPlanificacionTempIntId`;