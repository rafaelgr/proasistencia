ALTER TABLE `facturas`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(7,4) NULL;
ALTER TABLE `prefacturas`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(7,4) NULL;
ALTER TABLE `ofertas`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(7,4) NOT NULL COMMENT '% sobre el coste para calcular beneficio';