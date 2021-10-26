ALTER TABLE `proveedores`   
  ADD COLUMN `login` VARCHAR(255) NULL AFTER `activa`,
  ADD COLUMN `password` VARCHAR(255) NULL AFTER `login`,
   ADD COLUMN `playerId` VARCHAR(255) NULL AFTER `password`;

  ALTER TABLE `servicios`   
  ADD COLUMN `proveedorId` INT(11) NULL AFTER `observacionesOperador`,
  ADD CONSTRAINT `ref_servicio_proveedor` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`) ON UPDATE CASCADE ON DELETE NO ACTION;

  ALTER TABLE `servicios`   
  ADD COLUMN `cerrado` TINYINT(1) DEFAULT 0 NULL AFTER `proveedorId`;

  ALTER TABLE `servicios`   
  ADD COLUMN `confirmado` TINYINT(1) DEFAULT 0 NULL AFTER `cerrado`;

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
  ADD COLUMN `dniFirmante` VARCHAR(255) NULL AFTER `nombreFirmante`,
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


