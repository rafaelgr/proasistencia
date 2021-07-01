ALTER TABLE `facturas`   
  ADD COLUMN `liquidadaComercial` TINYINT(1) DEFAULT 0 NULL AFTER `liquidadaAgente`;


ALTER TABLE `contratos`   
  ADD COLUMN `contratoIntereses` TINYINT(11) NULL AFTER `fechaFirmaActa`;

ALTER TABLE `proasistencia`.`contratos`   
  CHANGE `contratoIntereses` `contratoIntereses` TINYINT(11) DEFAULT 0 NULL;

  


UPDATE contratos SET contratoIntereses = 0