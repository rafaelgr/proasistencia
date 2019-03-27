CREATE TABLE `estados_partes` ( 
`estadoParteId` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del estado',
`nombre` VARCHAR(255) NOT NULL COMMENT 'Nombre del estado del parte',
PRIMARY KEY (`estadoParteId`)
);

INSERT INTO estados_partes (nombre) VALUES('Pendiente de asignación'), ('Asignado'), ('Ejecución'), ('Parado'), ('Acabado'), ('Anulado');

CREATE TABLE `partes` ( 
`parteId` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del parte de trabajo',
`servicioId` INT(11) NOT NULL  COMMENT 'Identificador del servicio asociado',
`empresaId` INT(11) NOT NULL COMMENT 'Identificador de la empresa que se encarga',
`operadorId` INT(11) COMMENT 'Usuario responsable de la operación',
`tipoProfesionalId` INT(11) COMMENT 'Indica el tipo de profesional que se hará cargo de la avería',
`proveedorId` INT(11) COMMENT 'Profesinal al que el operador le asigna el trabajo',
`fecha_solicitud` DATETIME COMMENT 'Fecha y hora en al que se realiza la solcitud',
`presupuesto` BOOL DEFAULT FALSE COMMENT 'Indica si media presupeusto para este servicio',
`refPresupuesto` VARCHAR(255) COMMENT 'Referencia al presupuesto caso de que haya uno',
`fecha_prevista` DATE COMMENT 'Fecha prevista en la que se realizarán los trabajos',
`fecha_reparacion` DATE COMMENT 'Fecha en la que realmente se ha hecho la reparación',
`fecha_factura_cliente` DATE COMMENT 'Fecha en la que se le emitión la factura',
`numero_factura_cliente` VARCHAR(255) COMMENT 'Numero de la factura del cliente',
`importe_cliente` DECIMAL(12,2) COMMENT 'Importe de la factura al cliente',
`fecha_cobro_cliente` DATE COMMENT 'Fecha en la que se ha relaizado el cobro de la factura el cliente',
`fecha_factura_profesional` DATE COMMENT 'Fecha en la que nos emite el profesional la factura',
`numero_factura_profesional` VARCHAR(255) COMMENT 'Numero de la factura emitida por el profesional por los servicios',
`importe_profesional` DECIMAL(12,2) COMMENT 'Importe que nos cobra el profesional por los servicios',
`fecha_pago_profesional` DATE COMMENT 'Fecha en la que se le hace efectivo el pago al profesional',
`resultado` DECIMAL(12,2) COMMENT 'Diferencia entre el importe facturado al cliente y el cobrado por el profesional',
`descripcion_averia` TEXT COMMENT 'Descripción de la avería',
`trabajos_realizados` TEXT COMMENT 'Desccripción de los trabajos realizados',
`observaciones` TEXT COMMENT 'Campo de observaciones',
PRIMARY KEY (`parteId`),
CONSTRAINT `ref_parte_servicio` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`servicioId`),
CONSTRAINT `ref_parte_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`),
CONSTRAINT `ref_parte_usuario` FOREIGN KEY (`operadorId`) REFERENCES `usuarios`(`usuarioId`),
CONSTRAINT `ref_parte_profesional` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`),
CONSTRAINT `ref_part_tipoprofesional` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`)
);

CREATE TABLE `estados_partes_profesional` ( 
`estadoParteProfesionalId` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del estado del parte desde el punto de vista del profesional',
`nombre` VARCHAR(255) COMMENT 'Nombre del estado',
PRIMARY KEY (`estadoParteProfesionalId`)
);

