ALTER TABLE `facturas`   
  ADD COLUMN `generada` BOOL DEFAULT FALSE NULL AFTER `coste`,
  ADD COLUMN `porcentajeBeneficio` DECIMAL(5,2) NULL AFTER `generada`,
  ADD COLUMN `porcentajeAgente` DECIMAL(5,2) NULL AFTER `porcentajeBeneficio`;

CREATE TABLE `ofertas`(  
  `ofertaId` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la oferta como contador autoincremental',
  `tipoOfertaId` INT(11) NOT NULL COMMENT 'Tipo de la oferta = tipo mantenimiento',
  `referencia` VARCHAR(255) NOT NULL COMMENT 'Referencia de la oferta pa5ra búsquedas',		/* Length must be specified for varchar data type */
  `empresaId` INT(11) NOT NULL COMMENT 'Empresa propia que realiza la oferta',
  `clienteId` INT(11) NOT NULL COMMENT 'Cliente final al que va dirigida la oferta',
  `mantenedorId` INT(11) COMMENT 'Mantenedor (si es que lo hay) que media en la oferta',
  `agenteId` INT(11) COMMENT 'Agente (comerciales) que se asocia a la oferta',
  `fechaOferta` DATE NOT NULL COMMENT 'Fecha de creación de la oferta',
  `coste` DECIMAL(12,2) NOT NULL COMMENT 'Coste global de la oferta',
  `porcentajeBeneficio` DECIMAL(5,2) NOT NULL COMMENT '% sobre el coste para calcular beneficio',
  `importeBeneficio` DECIMAL(12,2) NOT NULL COMMENT 'Importe del beneficio',
  `ventaNeta` DECIMAL(12,2) NOT NULL COMMENT 'Coste + Beneficio',
  `porcentajeAgente` DECIMAL(5,2) COMMENT 'Porcentaje de comision del agente (sobre importeCliente)',
  `importeAgente` DECIMAL(12,2) COMMENT 'Importe del agente',
  `importeCliente` DECIMAL(12,2) NOT NULL COMMENT 'VentaNeta + ImporteAgente',
  `importeMantenedor` DECIMAL(12,2) COMMENT 'ImporteMantenedor = ImporteCliente - VentaNeta + beneficio',
  `observaciones` TEXT,
  PRIMARY KEY (`ofertaId`),
  CONSTRAINT `of_tipoMantenimiento` FOREIGN KEY (`tipoOfertaId`) REFERENCES `tipos_mantenimiento`(`tipoMantenimientoId`),
  CONSTRAINT `of_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`),
  CONSTRAINT `of_cliente` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`clienteId`),
  CONSTRAINT `of_mantenedor` FOREIGN KEY (`mantenedorId`) REFERENCES `clientes`(`clienteId`),
  CONSTRAINT `of_agente` FOREIGN KEY (`agenteId`) REFERENCES `comerciales`(`comercialId`)
);

ALTER TABLE `ofertas`   
  ADD COLUMN `formaPagoId` INT(11) NULL AFTER `observaciones`,
  ADD CONSTRAINT `of_formaPago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago`(`formaPagoId`);
