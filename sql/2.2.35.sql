ALTER TABLE `articulos`   
  ADD COLUMN `tipoProfesionalId` INT(11) NULL AFTER `unidadId`,
  ADD CONSTRAINT `ref_art_tiposProfesiones` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`);

  UPDATE articulos SET tipoProfesionalId = 2 WHERE codigoReparacion LIKE '1__.%';
