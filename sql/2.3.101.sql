ALTER TABLE `proveedores`   
  ADD COLUMN `login` VARCHAR(255) NULL AFTER `activa`,
  ADD COLUMN `password` VARCHAR(255) NULL AFTER `login`,
   ADD COLUMN `playerId` VARCHAR(255) NULL AFTER `password`;

  ALTER TABLE `servicios`   
  ADD COLUMN `proveedorId` INT(11) NULL AFTER `observacionesOperador`,
  ADD CONSTRAINT `ref_servicio_proveedor` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`) ON UPDATE CASCADE ON DELETE NO ACTION;

  ALTER TABLE `servicios`   
  ADD COLUMN `cerrado` TINYINT(1) DEFAULT 0 NULL AFTER `proveedorId`;

  ALTER TABLE `partes`   
  ADD COLUMN `confirmado` TINYINT(1) DEFAULT 0 NULL AFTER `firma`;

  ALTER TABLE `parametros`   
  ADD COLUMN `appId` VARCHAR(255) NULL AFTER `raiz_url`,
  ADD COLUMN `gcm` VARCHAR(255) NULL AFTER `appId`,
  ADD COLUMN `tituloPush` VARCHAR(255) NULL AFTER `gcm`,
  ADD COLUMN `restApi` VARCHAR(255) NULL AFTER `tituloPush`;



  CREATE TABLE `mensajes`(  
  `mensajeId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `asunto` VARCHAR(255),
  `texto` TEXT,
  `estado` VARCHAR(255),
  `fecha` DATETIME,
  `pushId` VARCHAR(255),
  `usuarioId` INT(11),
  PRIMARY KEY (`mensajeId`),
  CONSTRAINT `mensajes_usuariosFk` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`usuarioId`) ON UPDATE CASCADE ON DELETE NO ACTION
);


CREATE TABLE `mensajes_proveedoresPush`(  
  `mensajeId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `proveedorId` INT(11) NOT NULL,
  `estado` VARCHAR(255),
  `fecha` DATETIME,
  PRIMARY KEY (`mensajeId`, `proveedorId`),
  CONSTRAINT `mensajes_proveedorFK` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`)
);

ALTER TABLE `mensajes_proveedorespush`   
  ADD COLUMN `mensajeProveedorPushId` INT(11) UNSIGNED NOT NULL FIRST,
  CHANGE `mensajeId` `mensajeId` INT(11) UNSIGNED NOT NULL, 
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (`mensajeProveedorPushId`);

  ALTER TABLE `mensajes_proveedorespush`  
  ADD CONSTRAINT `mensajes_mensajeFK` FOREIGN KEY (`mensajeId`) REFERENCES `mensajes`(`mensajeId`);

  ALTER TABLE `mensajes_proveedorespush`   
  CHANGE `mensajeProveedorPushId` `mensajeProveedorPushId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT;

  ALTER TABLE `partes`   
  ADD COLUMN `nombreFirmante` VARCHAR(255) NULL AFTER `antesPre`,
  ADD COLUMN `apellidosFirmante` VARCHAR(255) NULL AFTER `nombreFirmante`;
  ADD COLUMN `dniFirmante` VARCHAR(255) NULL AFTER `apellidosFirmante`,
  ADD COLUMN `firma` VARCHAR(255) NULL AFTER `dniFirmante`;


ALTER TABLE `servicios`   
  ADD COLUMN `poblacionTrabajo` VARCHAR(255) NULL AFTER `direccionTrabajo`;

  UPDATE  servicios AS ser
  INNER JOIN clientes AS cli ON cli.clienteId = ser.clienteId
  SET ser.poblacionTrabajo = cli.poblacion2

ALTER TABLE `partes`   
  ADD COLUMN `observacionesProfesional` TEXT NULL AFTER `observaciones`;


ALTER TABLE `mensajes`   
  ADD COLUMN `presupuesto` TINYINT(1) DEFAULT 0 NULL AFTER `usuarioId`,
  ADD COLUMN `urgente` TINYINT(1) DEFAULT 0 NULL AFTER `presupuesto`;

  ALTER TABLE `mensajes`   
  ADD COLUMN `servicioId` INT(11) NULL AFTER `urgente`,
  ADD CONSTRAINT `mensajes_serviciosFK` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`servicioId`) ON DELETE SET NULL;


ALTER TABLE `partes`   
  ADD COLUMN `trabajosPendientes` TEXT NULL AFTER `observacionesProfesional`,
  ADD COLUMN `reparacionRealizada` TEXT NULL AFTER `trabajosPendientes`;

  UPDATE mensajes SET servicioId = NULL

  ALTER TABLE `mensajes`  
  DROP FOREIGN KEY `mensajes_serviciosFK`;

  ALTER TABLE `mensajes`   
  DROP INDEX `mensajes_serviciosFK`;

  ALTER TABLE `mensajes`   
  CHANGE `servicioId` `parteId` INT(11) NULL,
  ADD CONSTRAINT `mensajes_partesFk` FOREIGN KEY (`parteId`) REFERENCES `partes`(`parteId`) ON DELETE CASCADE;

  ALTER TABLE `partes`   
  ADD COLUMN `noFirma` TINYINT(1) DEFAULT 0 NULL AFTER `confirmado`;



UPDATE partes SET confirmado = 1 WHERE estadoParteProfesionalId = 2;
UPDATE partes SET confirmado = 1 WHERE estadoParteProfesionalId = 6;

///

ALTER TABLE `servicios`   
  DROP COLUMN `proveedorId`, 
  DROP INDEX `ref_servicio_proveedor`,
  DROP FOREIGN KEY `ref_servicio_proveedor`;


CREATE TABLE `parte_fotos`(  
  `parteFotoId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `parteId` INT(11) NOT NULL,
  `src` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`parteFotoId`)
);

////

ALTER TABLE `partes`   
  ADD COLUMN `observacionesDelProfesional` VARCHAR(255) NULL AFTER `noFirma`;

  ALTER TABLE `partes`   
  ADD COLUMN `cargoFirmante` VARCHAR(255) NULL AFTER `dniFirmante`;


  ///

  ALTER TABLE `partes`   
  CHANGE `FactPropiaPro` `FactPropiaPro` TINYINT(1) DEFAULT 0 NULL  AFTER `aCuentaCli`,
  CHANGE `fecha_solicitud` `fecha_solicitud` DATETIME NULL COMMENT 'Fecha y hora en al que se realiza la solcitud'  AFTER `ano`,
  CHANGE `fecha_prevista` `fecha_prevista` DATE NULL COMMENT 'Fecha prevista en la que se realizarán los trabajos'  AFTER `fecha_solicitud`,
  CHANGE `fecha_reparacion` `fecha_reparacion` DATE NULL COMMENT 'Fecha en la que realmente se ha hecho la reparación'  AFTER `fecha_prevista`,
  CHANGE `fecha_factura_cliente` `fecha_factura_cliente` DATE NULL COMMENT 'Fecha en la que se le emitión la factura'  AFTER `fecha_reparacion`,
  CHANGE `fecha_factura_profesional` `fecha_factura_profesional` DATE NULL COMMENT 'Fecha en la que nos emite el profesional la factura'  AFTER `fecha_factura_cliente`,
  CHANGE `fecha_cobro_cliente` `fecha_cobro_cliente` DATE NULL COMMENT 'Fecha en la que se ha relaizado el cobro de la factura el cliente'  AFTER `fecha_factura_profesional`,
  CHANGE `fecha_pago_profesional` `fecha_pago_profesional` DATE NULL COMMENT 'Fecha en la que se le hace efectivo el pago al profesional'  AFTER `fecha_cobro_cliente`,
  ADD COLUMN `fecha_firma` DATE NULL AFTER `fecha_cierre_profesional`,
  CHANGE `ofertaId` `ofertaId` INT(11) NULL  AFTER `observacionesDelProfesional`;












