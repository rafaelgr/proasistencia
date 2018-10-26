CREATE TABLE `servicios` ( 
`servicioId` INT(11) NOT NULL AUTO_INCREMENT,
`usuarioId` INT(11),
`clienteId` INT(11),
`agenteId` INT(11),
`tipoProfesionalId` INT(11),
`fechaCreacion` DATETIME,
`calle` VARCHAR(255),
`numero` VARCHAR(255),
`poblacion` VARCHAR(255),
`codPostal` VARCHAR(255),
`provincia` VARCHAR(255),
`localAfectado` VARCHAR(255),
`personaContacto` VARCHAR(255),
`telefono1` VARCHAR(255),
`telefono2` VARCHAR(255),
`correoElectronico` VARCHAR(255),
`deHoraAtencion` VARCHAR(255),
`aHoraAtencion` VARCHAR(255),
`deDiaSemana` VARCHAR(255),
`aDiaSemana` VARCHAR(255),
`descripcion` TEXT,
`autorizacion` BOOL DEFAULT FALSE,
PRIMARY KEY (`servicioId`),
CONSTRAINT `refserv_usuario` FOREIGN KEY (`usuarioId`) REFERENCES `proasistencia`.`usuarios`(`usuarioId`),
CONSTRAINT `refserv_cliente` FOREIGN KEY (`clienteId`) REFERENCES `proasistencia`.`clientes`(`clienteId`),
CONSTRAINT `refserv_agente` FOREIGN KEY (`agenteId`) REFERENCES `proasistencia`.`comerciales`(`comercialId`),
CONSTRAINT `refserv_tipo_profesional` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `proasistencia`.`tipos_profesionales`(`tipoProfesionalId`)
);

ALTER TABLE `comerciales` 
ADD COLUMN `loginWeb` VARCHAR(255) NULL AFTER `motivoBajaId`,
ADD COLUMN `passWeb` VARCHAR(255) NULL AFTER `loginWeb`;