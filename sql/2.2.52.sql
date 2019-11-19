ALTER TABLE `departamentos`   
  ADD COLUMN `usaCalculadora` TINYINT(1) DEFAULT 1 NULL AFTER `nombre`;

UPDATE departamentos SET usaCalculadora = 0 WHERE departamentoId = 7;

ALTER TABLE `ofertas` ADD CONSTRAINT `of_departamentos` FOREIGN KEY (`tipoOfertaId`) 
REFERENCES `departamentos`(`departamentoId`), DROP FOREIGN KEY `of_tipoMantenimiento`; 

CREATE TABLE `contrato_porcentajes`(  
  `contratoPorcenId` INT(11) NOT NULL AUTO_INCREMENT,
  `contratoId` INT(11),
  `concepto` VARCHAR(255),
  `porcentaje` DECIMAL(12,2),
  PRIMARY KEY (`contratoPorcenId`),
  CONSTRAINT `contratos_porcentajesFK` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`)
);

ALTER TABLE `contrato_porcentajes`   
  ADD COLUMN `fecha` DATE NULL AFTER `porcentaje`;
