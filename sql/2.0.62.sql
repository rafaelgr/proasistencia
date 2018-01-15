ALTER TABLE `proveedores`   
  ADD COLUMN `codigo` INT(11) NULL AFTER `formaPagoId`;

  CREATE TABLE `tipos_proveedor`(  
  `tipoProveedorId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tipoProveedorId`)
);

ALTER TABLE `proasistencia`.`proveedores`   
  ADD COLUMN `codigoProfesional` VARCHAR(255) NULL AFTER `codigo`,
  ADD COLUMN `tipoProfesional` INT(11) NULL AFTER `codigoProfesional`,
  ADD COLUMN `fianza` DECIMAL(10,2) NULL AFTER `tipoProfesional`;

  ALTER TABLE `proasistencia`.`proveedores`   
  ADD  KEY `proveedores_tipoProveedor` (`tipoProfesional`);
