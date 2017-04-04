ALTER TABLE `contratos`   
  CHANGE `coste` `coste` DECIMAL(14,4) NOT NULL COMMENT 'Coste global de el contrato';
ALTER TABLE `prefacturas`   
  CHANGE `coste` `coste` DECIMAL(14,4) NULL;  
ALTER TABLE `prefacturas_lineas`   
  CHANGE `coste` `coste` DECIMAL(14,4) NULL;
ALTER TABLE `facturas`   
  CHANGE `coste` `coste` DECIMAL(14,4) NULL;  
ALTER TABLE `facturas_lineas`   
  CHANGE `coste` `coste` DECIMAL(14,4) NULL;
ALTER TABLE `prefacturas_lineas`   
  CHANGE `importe` `importe` DECIMAL(14,4) NULL;  
ALTER TABLE `facturas_lineas`   
  CHANGE `importe` `importe` DECIMAL(14,4) NULL;    

ALTER TABLE `prefacturas_lineas`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(7,4) NULL;
ALTER TABLE `facturas_lineas`   
  CHANGE `porcentajeBeneficio` `porcentajeBeneficio` DECIMAL(7,4) NULL;  