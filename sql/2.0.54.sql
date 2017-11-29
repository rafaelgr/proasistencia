CREATE TABLE `proveedores`(  
  `proveedorId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  `nif` VARCHAR(255),
  `direccion` VARCHAR(255),
  `codPostal` VARCHAR(255),
  `poblacion` VARCHAR(255),
  `provincia` VARCHAR(255),
  `telefono` VARCHAR(255),
  `correo` VARCHAR(255),
  PRIMARY KEY (`proveedorId`)
);
