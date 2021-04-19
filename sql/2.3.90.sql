ALTER TABLE `usuarios`   
  ADD COLUMN `puedeEditar` TINYINT(1) DEFAULT 0 NULL AFTER `puedeVisualizar`;

  CREATE TABLE `proveedores_profesiones`(  
  `proveedorProfesionId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `proveedorId` INT(11),
  `tipoProfesionalId` INT(11),
  PRIMARY KEY (`proveedorProfesionId`),
  CONSTRAINT `proveedoresProfesiones_tipos_profesionales` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`),
  CONSTRAINT `proveedoresProfesiones_proveedores` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`)
);
INSERT INTO `proveedores_profesiones`
SELECT 0 AS proveedorProfesionId, proveedorId, tipoProfesionalId FROM proveedores WHERE NOT tipoProfesionalId IS NULL;
