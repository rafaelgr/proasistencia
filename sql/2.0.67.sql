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