ALTER TABLE `proveedores`   
  ADD COLUMN `codigo` INT(11) NULL AFTER `formaPagoId`;

  CREATE TABLE `tipos_proveedor`(  
  `tipoProveedorId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tipoProveedorId`)
);
