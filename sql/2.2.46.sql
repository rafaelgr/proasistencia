ALTER TABLE `clientes`   
  CHANGE `limiteCredito` `limiteCredito` DECIMAL(12,2) DEFAULT 0 NULL;

UPDATE clientes SET limiteCredito = 0 WHERE limiteCredito IS NULL;

CREATE TABLE `proveedores_departamentos`(  
  `ProveedorDepartamentoId` INT(11) NOT NULL AUTO_INCREMENT,
  `departamentoId` INT(11),
  `proveedorId` INT(11),
  PRIMARY KEY (`ProveedorDepartamentoId`),
  CONSTRAINT `proveedoresDepartamentos_proveedores` FOREIGN KEY (`proveedorId`) REFERENCES  `proveedores`(`proveedorId`),
  CONSTRAINT `proveedoresDepartamentos_departamentos` FOREIGN KEY (`departamentoId`) REFERENCES  `departamentos`(`departamentoId`)
);
