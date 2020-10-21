ALTER TABLE `proasistencia`.`contratos`   
  CHANGE `coste` `coste` DECIMAL(14,6) NOT NULL COMMENT 'Coste global de el contrato',
  CHANGE `importeBeneficio` `importeBeneficio` DECIMAL(16,6) NOT NULL COMMENT 'Importe del beneficio',
  CHANGE `ventaNeta` `ventaNeta` DECIMAL(16,6) NOT NULL COMMENT 'Coste + Beneficio',
  CHANGE `porcentajeAgente` `porcentajeAgente` DECIMAL(11,6) NULL COMMENT 'Porcentaje de comision del agente (sobre importeCliente)',
  CHANGE `importeAgente` `importeAgente` DECIMAL(16,6) NULL COMMENT 'Importe del agente',
  CHANGE `importeCliente` `importeCliente` DECIMAL(16,6) NOT NULL COMMENT 'VentaNeta + ImporteAgente',
  CHANGE `importeMantenedor` `importeMantenedor` DECIMAL(16,6) NULL COMMENT 'ImporteMantenedor = ImporteCliente - VentaNeta + beneficio',
  CHANGE `total` `total` DECIMAL(16,6) NULL,
  CHANGE `totalConIva` `totalConIva` DECIMAL(16,6) NULL;


ALTER TABLE `proasistencia`.`contratos_lineas`   
  CHANGE `importe` `importe` DECIMAL(14,6) NULL,
  CHANGE `totalLinea` `totalLinea` DECIMAL(16,6) NULL,
  CHANGE `coste` `coste` DECIMAL(16,6) NULL;
