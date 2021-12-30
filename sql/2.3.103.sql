ALTER TABLE `facturas`   
  ADD COLUMN `noCobro` TINYINT(1) DEFAULT 0 NULL AFTER `liquidadaComercial`;


ALTER TABLE `ofertas`   
  ADD COLUMN `rappelAgente` DECIMAL(5,2) DEFAULT 0 NULL AFTER `importeCliente`;

