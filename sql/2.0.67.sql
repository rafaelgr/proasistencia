CREATE TABLE `facprove_serviciados`(  
  `facproveServiciadoId` INT(11) NOT NULL AUTO_INCREMENT,
  `facproveId` INT(11),
  `empresaId` INT(11),
  `contratoId` INT(11),
  `importe` DECIMAL(12,2),
  PRIMARY KEY (`facproveServiciadoId`),
  CONSTRAINT `serviciados_facproveFK` FOREIGN KEY (`facproveId`) REFERENCES `facprove`(`facproveId`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `serviciados_empresaFK` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `serviciados_contratoFK` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE `facprove_serviciados`   
  ADD  UNIQUE INDEX `serviciados_unique` (`facproveId`, `empresaId`, `contratoId`);

  ALTER TABLE `facprove`   
  ADD COLUMN `noContabilizar` BOOLEAN NULL AFTER `fecha_recepcion`;

  INSERT INTO grupo_articulo (nombre) VALUES ('ALBAÑILERIA'), ('CERRAJERIA'), ('CRISTALERIA'), 
  ('ELECTRICIDAD'), ('FONTANERIA'), ('PINTORES'), ('POCERIA');


  INSERT INTO grupo_tarifa VALUES(10, 'GRUPO GENERAL');

INSERT INTO tarifas VALUES(1, 10, 'Prof. tarifa 1'), (2, 10, 'Prof. tarifa 2'), (3, 10, 'Prof. tarifa 4'), (4, 10, 'Prof. tarifa 5'), 
(5, 10, 'Prof. tarifa 6');

INSERT INTO facprove_serviciados (facproveId, empresaId, contratoId, importe) (SELECT facproveId, empresaId, contratoId, total AS importe FROM facprove);

ALTER TABLE `tarifas_lineas` DROP FOREIGN KEY `tarifaLineasTarifasFK`;

ALTER TABLE `tarifas_lineas` ADD CONSTRAINT `tarifaLineasTarifasFK` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE TEMPORARY TABLE tarifa_temp AS (SELECT 6 AS tarifaId, articuloId, 0 AS precioUnitario FROM tarifas_lineas
 WHERE tarifaId = 1 OR tarifaId = 2 OR tarifaId = 3 OR tarifaId = 4 OR tarifaId = 5)
 INSERT INTO tarifas_lineas (tarifaId, articuloId, precioUnitario) (SELECT * FROM tarifa_temp)

