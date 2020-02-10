ALTER TABLE `articulos`   
  ADD COLUMN `coste` DECIMAL(10,2) DEFAULT 0 NULL AFTER `varios`,
  ADD COLUMN `porcentaje` DECIMAL(10,2) DEFAULT 80 NULL AFTER `coste`,
  ADD COLUMN `precioVenta` DECIMAL(10,2) DEFAULT 0 NULL AFTER `porcentaje`;

  ALTER TABLE `tipos_proveedor`   
  ADD COLUMN `inicioCuentaFianza` INT(11) NULL AFTER `inicioCuenta`;

  UPDATE tipos_proveedor SET inicioCuentaFianza = 180;


