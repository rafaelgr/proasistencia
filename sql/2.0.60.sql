ALTER TABLE `proasistencia`.`proveedores`   
  CHANGE `tipoViaId` `tipoViaId` INT(11) NULL  AFTER `poblacion`,
  ADD COLUMN `telefono2` VARCHAR(255) NULL AFTER `telefono`,
  ADD COLUMN `movil` VARCHAR(255) NULL AFTER `telefono2`,
  ADD COLUMN `movil2` VARCHAR(255) NULL AFTER `movil`,
  ADD COLUMN `correo2` VARCHAR(255) NULL AFTER `correo`,
  ADD COLUMN `persona_contacto` VARCHAR(255) NULL AFTER `correo2`,
  ADD COLUMN `IBAN` VARCHAR(255) NULL AFTER `persona_contacto`,
  ADD COLUMN `fechaAlta` DATE NULL AFTER `IBAN`,
  ADD COLUMN `fechaBaja` DATE NULL AFTER `fechaAlta`,
  ADD COLUMN `motivo_baja` VARCHAR(255) NULL AFTER `fechaBaja`,
  ADD COLUMN `cuentaContable` VARCHAR(255) NULL AFTER `motivo_baja`,
  ADD COLUMN `formaPagoId` INT(11) NULL AFTER `cuentaContable`,
  ADD CONSTRAINT `proveedores_formaPago` FOREIGN KEY (`formaPagoId`) REFERENCES `proasistencia`.`formas_pago`(`formaPagoId`) ON UPDATE CASCADE ON DELETE CASCADE;
