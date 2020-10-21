ALTER TABLE `proasistencia`.`contratos`   
  CHANGE `coste` `coste` DECIMAL(20,10) NOT NULL COMMENT 'Coste global de el contrato',
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(13,10) NOT NULL COMMENT '% sobre el coste para calcular beneficio',
  CHANGE `importeBeneficio` `importeBeneficio` DECIMAL(20,10) NOT NULL COMMENT 'Importe del beneficio';

  ALTER TABLE `proasistencia`.`contratos_lineas`   
  CHANGE `coste` `coste` DECIMAL(20,10) NULL,
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(13,10) NULL,
  CHANGE `importe` `importe` DECIMAL(20,10) NULL

ALTER TABLE `proasistencia`.`prefacturas`   
  CHANGE `coste` `coste` DECIMAL(20,10) NULL,
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(13,10) NULL;

  
  ALTER TABLE prefacturas_lineas
  CHANGE `coste` `coste` DECIMAL(20,10) NULL,
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(13,10) NULL,
  CHANGE `importe` `importe` DECIMAL(20,10) NULL
