CREATE TABLE `prefacturas_lineas_actualizadas`(  
  `prefacturaPrecioId` INT(11) NOT NULL AUTO_INCREMENT,
  `contratoId` INT(11),
  `prefacturaId` INT(11),
  `prefacturaLineaId` INT(11),
  `importe` DECIMAL(14,4),
  `totalLinea` DECIMAL(12,2),
  `coste` DECIMAL(14,4),
  PRIMARY KEY (`prefacturaPrecioId`)
);

ALTER TABLE `contratos`   
  ADD COLUMN `antTotalCliente` DECIMAL(12,2) DEFAULT 0 NULL AFTER `fechaFinAlquiler`,
  ADD COLUMN `fechaActulizacionContrato` DATE NULL AFTER `antTotalCliente`;
