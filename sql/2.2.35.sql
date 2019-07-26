ALTER TABLE `articulos`   
  ADD COLUMN `tipoProfesionalId` INT(11) NULL AFTER `unidadId`,
  ADD CONSTRAINT `ref_art_tiposProfesiones` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`);


INSERT INTO tipos_profesionales (nombre) VALUES('CERRAJERO'), ('POCERO'), ('ANTENISTA'), ('CRISTALERO');

UPDATE articulos SET tipoProfesionalId = 2 WHERE codigoReparacion LIKE '1__.%';

UPDATE articulos SET tipoProfesionalId = 4 WHERE codigoReparacion LIKE '2__.%';

UPDATE articulos SET tipoProfesionalId = 6 WHERE codigoReparacion LIKE '3__.%';

UPDATE articulos SET tipoProfesionalId = 3 WHERE codigoReparacion LIKE '4__.%';

UPDATE articulos SET tipoProfesionalId = 5 WHERE codigoReparacion LIKE '5__.%';

UPDATE articulos SET tipoProfesionalId = 7 WHERE codigoReparacion LIKE '6__.%';

UPDATE articulos SET tipoProfesionalId = 8 WHERE codigoReparacion LIKE '7__.%';

UPDATE articulos SET tipoProfesionalId = 9 WHERE codigoReparacion LIKE '9__.%';


