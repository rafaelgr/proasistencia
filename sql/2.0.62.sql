ALTER TABLE `proveedores`   
  ADD COLUMN `codigo` INT(11) NULL AFTER `formaPagoId`;

  CREATE TABLE `tipos_proveedor`(  
  `tipoProveedorId` INT(11)  NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tipoProveedorId`)
);

ALTER TABLE `proveedores`   
  ADD COLUMN `codigoProfesional` VARCHAR(255) NULL AFTER `codigo`,
  ADD COLUMN `tipoProveedor` INT(11) NULL AFTER `codigoProfesional`,
  ADD COLUMN `fianza` DECIMAL(10,2) NULL AFTER `tipoProveedor`,
  ADD CONSTRAINT `proveedores_tipoProveedor` FOREIGN KEY (`tipoProveedor`) REFERENCES `tipos_proveedor`(`tipoProveedorId`) ON UPDATE CASCADE ON DELETE CASCADE;


ALTER TABLE `proveedores`   
  ADD  UNIQUE INDEX `unica_codigo` (`codigo`);


ALTER TABLE `proveedores`   
  CHANGE `motivo_baja` `motivoBajaId` INT(11) NULL;

ALTER TABLE `proveedores`  
  ADD CONSTRAINT `proveedores_motivosBaja` FOREIGN KEY (`motivoBajaId`) REFERENCES `motivos_baja`(`motivoBajaId`) ON UPDATE CASCADE ON DELETE CASCADE;

