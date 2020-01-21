ALTER TABLE `articulos`   
  ADD COLUMN `departamentoId` INT(11) NULL AFTER `tipoProfesionalId`,
  ADD CONSTRAINT `ref_art_departamentos` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`);

UPDATE articulos set departamentoId = 7 WHERE NOT codigoReparacion IS NULL; 

ALTER TABLE `articulos`   
  ADD COLUMN `varios` TINYINT(1) DEFAULT 0 NULL AFTER `departamentoId`;

ALTER TABLE `articulos`   
  ADD COLUMN `coste` DECIMAL(10,2) DEFAULT 0 NULL AFTER `varios`,
  ADD COLUMN `porcentaje` DECIMAL(10,2) DEFAULT 80 NULL AFTER `coste`,
  ADD COLUMN `precioVenta` DECIMAL(10,2) DEFAULT 0 NULL AFTER `porcentaje`;
