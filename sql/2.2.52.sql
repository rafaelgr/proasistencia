ALTER TABLE `departamentos`   
  ADD COLUMN `usaCalculadora` TINYINT(1) DEFAULT 1 NULL AFTER `nombre`;

UPDATE departamentos SET usaCalculadora = 0 WHERE departamentoId = 7;

ALTER TABLE `ofertas` ADD CONSTRAINT `of_departamentos` FOREIGN KEY (`tipoOfertaId`) 
REFERENCES `departamentos`(`departamentoId`), DROP FOREIGN KEY `of_tipoMantenimiento`; 

ALTER TABLE `facturas_lineas`   
  ADD COLUMN `importeBeneficioLinea` DECIMAL(14,4) NULL AFTER `porcentajeBeneficio`,
  ADD COLUMN `importeAgenteLinea` DECIMAL(14,4) NULL AFTER `porcentajeAgente`;

UPDATE facturas_lineas SET importeBeneficioLinea = ((coste * porcentajeBeneficio) / 100);
UPDATE facturas_lineas SET importeAgenteLinea = ((totalLinea * porcentajeAgente) / 100);
