ALTER TABLE `articulos`   
  ADD COLUMN `departamentoId` INT(11) NULL AFTER `tipoProfesionalId`,
  ADD CONSTRAINT `ref_art_departamentos` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`);

UPDATE articulos set departamentoId = 7 WHERE NOT codigoReparacion IS NULL; 
