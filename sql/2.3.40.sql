ALTER TABLE `contratos`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(9,6) NOT NULL COMMENT '% sobre el coste para calcular beneficio';


ALTER TABLE `prefacturas`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(9,6) NULL;


ALTER TABLE `facturas`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(9,6) NULL;


ALTER TABLE `ofertas`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(9,6) NOT NULL COMMENT '% sobre el coste para calcular beneficio';


ALTER TABLE `antprove`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(9,6) NULL;

  ALTER TABLE `antclien`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(9,6) NULL;

  ALTER TABLE `facprove`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(9,6) NULL;


