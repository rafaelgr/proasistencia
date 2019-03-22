CREATE TABLE `estados_partes` ( 
`estadoParteId` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del estado',
`nombre` VARCHAR(255) NOT NULL COMMENT 'Nombre del estado del parte',
PRIMARY KEY (`estadoParteId`)
);

INSERT INTO estados_partes (nombre) VALUES('Pendiente de asignación'), ('Asignado'), ('Ejecución'), ('Parado'), ('Acabado'), ('Anulado');