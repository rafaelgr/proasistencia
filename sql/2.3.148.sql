ALTER TABLE `prefacturas`   
  ADD COLUMN `numLetra` VARCHAR(255) DEFAULT '' NULL AFTER `fechaGestionCobros`;

  ALTER TABLE `facturas`   
  ADD COLUMN `numLetra` VARCHAR(255) DEFAULT '' NULL AFTER `noCobro`;

  ALTER TABLE `usuarios`   
  ADD COLUMN `borrarCarpeta` TINYINT(1) DEFAULT 0 NULL AFTER `usuarioWeb`;

