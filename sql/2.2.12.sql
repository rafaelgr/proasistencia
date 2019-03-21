DELETE FROM servicios;
DELETE FROM locales_afectados;
DROP TABLE locales_afectados;
DROP TABLE servicios;

CREATE TABLE `servicios` ( 
`servicioId` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria que identifica a un servicio,',
`agenteId` INT(11) NOT NULL COMMENT 'Clave referencia del agente responsable de la solicitud',
`operadorAgente` VARCHAR(255) COMMENT 'Operador del agente que abre el servicio',
`empresaId` INT(11) COMMENT 'Empresa de las nuestras a la que le toca el trabajo',
`clienteId` INT(11) COMMENT 'Cliente para el que se le solicita el trabajo',
`nombreCliente` VARCHAR(255) COMMENT 'Nombre del cliente para el que se hace el trabajo',
`direccionTrabajo` TEXT COMMENT 'Composición de los datos a partir de la dirección de trabajo del cliente',
`fechaEntrada` DATE COMMENT 'Fecha de entrada de la petición del servicio',
`horaEntrada` TIME COMMENT 'Hora de entrada de la solictud',
`urgente` BOOL DEFAULT 0 COMMENT 'Indica si el servicio es urgente o no',
`necesitaPresupuesto` BOOL DEFAULT 0 COMMENT 'Indica si hace falta un presupuesto previo o no',
`descripcionAveria` TEXT COMMENT 'Descripción de la averia',
`observacionesAgente` TEXT COMMENT 'Observacines del agente',
`observacionesOperador` TEXT COMMENT 'Observciones operador',
PRIMARY KEY (`servicioId`),
CONSTRAINT `ref_servicio_agente` FOREIGN KEY (`agenteId`) REFERENCES `comerciales`(`comercialId`) ON UPDATE CASCADE ON DELETE NO ACTION,
CONSTRAINT `ref_servicio_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`) ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE `locales_afectados` ( 
`localAfectadoId` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Clave primaria de los locales afectados',
`servicioId` INT COMMENT 'Servicio al que pertenece el local',
`nombreLocal` VARCHAR(255) COMMENT 'Nombre del local afetado',
`contacto` VARCHAR(255) COMMENT 'Persona de contacto para el local',
`telefono1` VARCHAR(255) COMMENT 'Telefono 1',
`telefono2` VARCHAR(255) COMMENT 'Telefono 2',
`correo` VARCHAR(255) COMMENT 'Correo electrónico',
`observaciones` TEXT COMMENT 'Campo de observaciones',
PRIMARY KEY (`localAfectadoId`),
CONSTRAINT `ref_locales_servicios` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`servicioId`) ON UPDATE CASCADE ON DELETE NO ACTION
);