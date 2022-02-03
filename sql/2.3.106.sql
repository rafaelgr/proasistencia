CREATE TABLE `proveedor_usuariosApp`(  
  `proveedorUsuarioId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `proveedorId` INT(11),
  `login` VARCHAR(255),
  `password` VARCHAR(255),
  PRIMARY KEY (`proveedorUsuarioId`)
);
