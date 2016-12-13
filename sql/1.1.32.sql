ALTER TABLE `prefacturas`   
  ADD COLUMN `totalAlCliente` DECIMAL(12,2) NULL AFTER `facturaId`,
  ADD COLUMN `costeProporcional` DECIMAL(12,2) NULL AFTER `totaAlCliente`;

ALTER TABLE `facturas`   
  ADD COLUMN `totalAlCliente` DECIMAL(12,2) NULL AFTER `facturaId`,
  ADD COLUMN `costeProporcional` DECIMAL(12,2) NULL AFTER `totaAlCliente`;  

ALTER TABLE `contrato_comercial`   
  CHANGE `manComisAgente` `manComisAgente` TINYINT(1) DEFAULT 0 NULL,
  CHANGE `manCostes` `manCostes` TINYINT(1) DEFAULT 0 NULL,
  CHANGE `manJefeObra` `manJefeObra` TINYINT(1) DEFAULT 0 NULL,
  CHANGE `manOficinaTecnica` `manOficinaTecnica` TINYINT(1) DEFAULT 0 NULL,
  CHANGE `manAsesorTecnico` `manAsesorTecnico` TINYINT(1) DEFAULT 0 NULL,
  CHANGE `manComercial` `manComercial` TINYINT(1) DEFAULT 0 NULL,
  CHANGE `comision` `comision` DECIMAL(5,2) DEFAULT 0.00 NULL;

CREATE TABLE `liquidacion_comercial`(  
  `liquidacionComercialId` INT(11) NOT NULL AUTO_INCREMENT,
  `facturaId` INT(11),
  `comercialId` INT(11),
  `contratoClienteMantenimientoId` INT(11),
  `impCliente` DECIMAL(12,2),
  `coste` DECIMAL(12,2),
  `CA` DECIMAL(12,2),
  `PC` DECIMAL(12,2),
  `PCA` DECIMAL(12,2),
  `PCO` DECIMAL(12,2),
  `ICO` DECIMAL(12,2),
  `IJO` DECIMAL(12,2),
  `IOT` DECIMAL(12,2),
  `IAT` DECIMAL(12,2),
  `IC` DECIMAL(12,2),
  `porComer` DECIMAL(5,2),
  `comision` DECIMAL(12,2),
  PRIMARY KEY (`liquidacionComercialId`),
  CONSTRAINT `liq_comer_factura` FOREIGN KEY (`facturaId`) REFERENCES `facturas`(`facturaId`),
  CONSTRAINT `liq_comer_comercial` FOREIGN KEY (`comercialId`) REFERENCES `comerciales`(`comercialId`),
  CONSTRAINT `liq_comer_contrato` FOREIGN KEY (`contratoClienteMantenimientoId`) REFERENCES `contrato_cliente_mantenimiento`(`contratoClienteMantenimientoId`)
);

ALTER TABLE `liquidacion_comercial`   
  ADD COLUMN `base` DECIMAL(12,2) NULL AFTER `porComer`;